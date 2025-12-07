import jwt from 'jsonwebtoken';;

import { NextResponse } from 'next/server';
const ACCESS_SECRET = process.env.ACCESS_SECRET;
export function authMiddleware(handler) {
  return async (req, next) => {
    try {
      const authorization = req.headers.get('authorization');
      
      if (!authorization) {
        return new Response(
          JSON.stringify({ message: 'No access token found!!' }),
          { status: 403 }
        );
      }

      // Remove "Bearer " prefix if present
      const token = authorization.startsWith('Bearer ') 
        ? authorization.substring(7) 
        : authorization;

      const payload = jwt.verify(token, ACCESS_SECRET);
      req.userId = payload.sub;
      
      return handler(req, next);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 403 }
      );
    }
  };
}