import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const stylePrompts = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",
  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",
  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",
  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",
  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    // Build prompt
    let prompt = `Professional YouTube thumbnail for "${title}". `;
    prompt += `Style: ${stylePrompts[style as keyof typeof stylePrompts]}. `;
    if (color_scheme) {
      prompt += `Color scheme: ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]}. `;
    }
    if (user_prompt) {
      prompt += `Scene: ${user_prompt}. `;
    }
    prompt += `Wide shot, 16:9 composition, ultra detailed, 4K quality, cinematic lighting, sharp focus, no text, no watermark.`;

    // Call Hugging Face API
    const hfResponse = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 1280,
            height: 720,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      },
    );

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      throw new Error(`Hugging Face error: ${errText}`);
    }

    const imageBuffer = Buffer.from(await hfResponse.arrayBuffer());

    // Save to disk
    const filename = `final-output-${Date.now()}.png`;
    const filePath = path.join("images", filename);
    fs.mkdirSync("images", { recursive: true });
    fs.writeFileSync(filePath, imageBuffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    thumbnail.image_url = uploadResult.url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({ message: "Thumbnail Generated", thumbnail });

    fs.unlinkSync(filePath);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;
    await Thumbnail.findByIdAndDelete({ _id: id, userId });
    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
