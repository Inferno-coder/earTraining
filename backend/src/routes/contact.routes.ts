import { Router } from 'express';
import { pool } from '../config/db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields' });
      return;
    }

    // Save message to postgres
    const query = `
      INSERT INTO public.contact_messages (name, email, category, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, email, category, message]);

    // Send email using Resend if API Key is configured in environment
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('[Contact API]: Forwarding message to email using Resend...');
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'ClearEar Studio <onboarding@resend.dev>',
            to: 'pradeepceo18@gmail.com',
            subject: `[ClearEar Studio] ${category} from ${name}`,
            html: `
              <h2>New Message Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-line; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
            `,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error('[Contact API]: Resend forwarding failed:', errData);
        } else {
          console.log('[Contact API]: Email forwarded successfully.');
        }
      } catch (emailErr) {
        console.error('[Contact API]: Error occurred while forwarding email:', emailErr);
      }
    }

    res.status(201).json({ success: true, message: 'Message sent successfully', data: rows[0] });
  } catch (error: any) {
    console.error('[Contact API Error]:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /testimonials - Retrieve all approved thank notes / testimonials (Public)
router.get('/testimonials', async (req, res) => {
  try {
    const query = `
      SELECT id, name, message, category, created_at
      FROM public.contact_messages
      WHERE approved = true
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error: any) {
    console.error('[Get Testimonials Error]:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/messages - Retrieve all messages (Admin-only, restricted to pradeepceo18@gmail.com)
router.get('/admin/messages', authMiddleware, async (req, res) => {
  try {
    if (req.user?.email !== 'pradeepceo18@gmail.com') {
      res.status(403).json({ error: 'Forbidden: Admin access only' });
      return;
    }

    const query = `
      SELECT id, name, email, category, message, approved, created_at
      FROM public.contact_messages
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error: any) {
    console.error('[Admin Get Messages Error]:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /admin/messages/:id - Toggle approved status (Admin-only, restricted to pradeepceo18@gmail.com)
router.patch('/admin/messages/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user?.email !== 'pradeepceo18@gmail.com') {
      res.status(403).json({ error: 'Forbidden: Admin access only' });
      return;
    }

    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      res.status(400).json({ error: 'Approved parameter must be a boolean value' });
      return;
    }

    const query = `
      UPDATE public.contact_messages
      SET approved = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [approved, id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (error: any) {
    console.error('[Admin Update Message Error]:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
