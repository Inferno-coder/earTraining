import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/lib';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized: Token is empty' });
      return;
    }

    // Retrieve user via Supabase client, which verifies the JWT signature and expiration
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: `Unauthorized: ${error?.message || 'Invalid or expired token'}` });
      return;
    }

    // Attach verified user information to the Express Request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err: any) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
