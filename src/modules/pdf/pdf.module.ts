import { Module } from '@nestjs/common';
import { PdfService } from './services/pdf.service';
import { PdfController } from './controllers/pdf.controller';

@Module({
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
