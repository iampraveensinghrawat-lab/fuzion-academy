import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, newPassword, confirmPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters with mixed characters.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation password do not match.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated! You may now log in with your new credentials.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Password update failed' },
      { status: 500 }
    );
  }
}
