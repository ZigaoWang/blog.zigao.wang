import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import defaultOg from '../assets/bg.jpg';

/**
 * Social cards want a 1200x630 JPEG.
 *
 * Pointing og:image straight at a hero image breaks previews in practice:
 * the originals run to several MB (WhatsApp and WeChat drop those silently),
 * they have arbitrary aspect ratios that get cropped unpredictably, and a
 * WebP source renders nowhere on X, LinkedIn or WeChat.
 *
 * Falls back to the site hero so every page has a working preview.
 */
export async function ogImageFor(src?: ImageMetadata): Promise<string> {
	const image = await getImage({
		src: src ?? defaultOg,
		width: 1200,
		height: 630,
		fit: 'cover',
		position: 'attention',
		format: 'jpeg',
		quality: 82,
	});
	return image.src;
}
