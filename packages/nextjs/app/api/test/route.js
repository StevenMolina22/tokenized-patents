// app/api/test/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  // Obtener todos los usuarios
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(req) {
  // Crear una propuesta
  const body = await req.json();

  const { error } = await supabase.from('inventions').insert([body]);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
