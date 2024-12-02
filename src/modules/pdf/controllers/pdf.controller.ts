// pdf.controller.ts
import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import { Clip } from 'src/graphql/generated';

class FileSignedUrl {
  url: string;
}

@Controller('/pdf')
export class PdfController {
  private logger = new Logger(PdfController.name);
  constructor(private pdfService: PdfService) {}

  @Post('/generate')
  async createPdf(
    @Body() data: Clip,
  ) {
    try {
      const url = await this.pdfService.createPdfFile(data);
      return { url }; 
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error generating PDF', 500);
    }
  }
}
