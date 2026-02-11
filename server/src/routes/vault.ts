import express from 'express';
import { supabase } from '../supabase';
import { upload } from '../middleware/upload';
import crypto from 'crypto';

const router = express.Router();

router.post(
  '/create',
  upload.single('file'),
  async (req, res) => {
    console.log('BODY:', req.body);
      console.log('FILE:', req.file);
    try {

      const type = req.body.type;
      const content = req.body.content ?? null;
      const password = req.body.password ?? null;
      const expires_at = req.body.expires_at;

      // 🔑 convert string → boolean
      const is_one_time = req.body.is_one_time === 'true';


      let file_path = null;
      let file_name = null;
      let mime_type = null;

      // 🔹 If file upload
      if (type === 'file' && req.file) {
        const safeName = req.file.originalname.replace(/\s+/g, '_');
        const storagePath = `${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('vault')
          .upload(storagePath, req.file.buffer, {
            contentType: req.file.mimetype
          });

        if (uploadError) throw uploadError;

        file_path = storagePath;
        file_name = req.file.originalname;
        mime_type = req.file.mimetype;
      }

      const { data, error } = await supabase
        .from('items')
        .insert([{
          type,
          content: type === 'text' ? content : null,
          file_path,
          file_name,
          mime_type,
          password,
          expires_at,
          is_one_time,
          view_count: 0
        }])
        .select()
        .single();

      if (error || !data) {
        return res.status(400).json({
          error: error?.message || 'Failed to create vault'
        });
      }

      return res.status(201).json({ id: data.id });


    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Vault not found' });
    }

    // ⏰ Expiry check
    if (new Date(item.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Vault expired' });
    }

    // ✅ Send data FIRST
    res.json(item);

    // 🔥 ONE-TIME LOGIC (after response)
    if (item.is_one_time) {
      // delete file if exists
      if (item.file_path) {
        await supabase.storage
          .from('vault')
          .remove([item.file_path]);
      }

      // delete DB record
      await supabase
        .from('items')
        .delete()
        .eq('id', id);
    }

  } catch (err: any) {
    console.error('Vault read error:', err.message);
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch vault
    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item || !item.file_path) {
      return res.status(404).json({ error: 'File not found' });
    }

    // 2️⃣ Download file
    const { data, error: downloadError } = await supabase.storage
      .from('vault')
      .download(item.file_path);

    if (downloadError || !data) {
      return res.status(500).json({ error: 'Download failed' });
    }

    // 3️⃣ Send file to client FIRST
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${item.file_name}"`
    );
    res.send(Buffer.from(await data.arrayBuffer()));

    // 4️⃣ 🔥 AFTER sending, cleanup if one-time
    // 🔥 ONE-TIME LOGIC (TEXT ONLY)
  if (item.is_one_time && item.type === 'text') {
    await supabase
      .from('items')
      .delete()
      .eq('id', id);
  }


  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
