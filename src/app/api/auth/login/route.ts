import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { USERS } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// For demo purposes - replace with actual database authentication
type SecurityCredential = {
  password: string;
};

type DepartmentCredential = {
  password: string;
};

type ValidCredentials = {
  security: SecurityCredential;
  rd: DepartmentCredential;
  steel_prod: DepartmentCredential;
  quality: DepartmentCredential;
  hr: DepartmentCredential;
  automation: DepartmentCredential;
};

const VALID_CREDENTIALS: ValidCredentials = {
  security: {
    password: 'security123',
  },
  rd: {
    password: 'rd123',
  },
  steel_prod: {
    password: 'steel123',
  },
  quality: {
    password: 'quality123',
  },
  hr: {
    password: 'hr123',
  },
  automation: {
    password: 'automation123',
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, role, departmentId } = body;

    // For security role
    if (role === 'security') {
      const validCredential = USERS.find(
        (user) => user.role === 'SECURITY' && user.password === password
      );

      if (!validCredential) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = sign(
        { id: validCredential.id, role: 'security' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Set cookies
      cookies().set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      cookies().set('user_role', 'security', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    // For department role
    if (role === 'department' && departmentId) {
      const validCredential = USERS.find(
        (user) =>
          user.role === 'DEPARTMENT' &&
          user.departmentId === departmentId &&
          user.password === password
      );

      if (!validCredential) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = sign(
        { id: validCredential.id, role: 'department', departmentId },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Set cookies
      cookies().set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      cookies().set('user_role', 'department', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      cookies().set('department_id', departmentId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 