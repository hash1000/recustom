import { Injectable } from '@nestjs/common';
import { Clip, Media_Type_Enum, Clip_Media } from 'src/graphql/generated';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async createPdfFile(data: Clip): Promise<string> {
    const { title, content, clip_media } = data;

    const validImages = clip_media.filter(
      (media) => media.type.toLowerCase() === Media_Type_Enum.Image,
    ) as Clip_Media[];
    
    if (validImages.length > 0) {
      const browser = await puppeteer.launch({ args: ['--allow-file-access-from-files', '--enable-local-file-accesses'] });
      const page = await browser.newPage();
      const TypeImg: string[] = [];

      for (const image of validImages) {
        if (image.source) {
          TypeImg.push(image.source);  
        }
      }
      
      await page.setContent(`${title} ${content}`);

      // Embed images
      await Promise.all(TypeImg.map(async (image) => {
        const imageFile = `./public/images/${image}`;
        const bitmap = fs.readFileSync(imageFile);
        const base64Image = Buffer.from(bitmap).toString('base64');
        const imageDataURI = 'data:image/png;base64,' + base64Image;
        
        await page.evaluate((imageDataURI) => {
          const img = new Image();
          img.src = imageDataURI;
          img.width=200;
          document.body.appendChild(img);
        }, imageDataURI);
      }));

      const filename = `./public/${uuidv4()}.pdf`;
      await page.pdf({ path: filename, format: 'A4' });
      await browser.close();
      return filename;
    } else {
      const errorMessage = 'No valid images found in clip_media.';
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
