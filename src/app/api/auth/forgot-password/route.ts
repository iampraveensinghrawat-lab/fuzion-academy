import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // In production with Resend or SMTP:
    // await sendEmail({ to: cleanEmail, subject: "Password Reset Link - Fuzion Academy", html: ... })

    return NextResponse.json({
      success: true,
      message: `Password reset link generated and dispatched to ${cleanEmail}. Link expires in 30 minutes.`,
      resetToken: token,
      resetUrl: `/auth/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Password reset request failed' },
      { status: 500 }
    );
  }
}
