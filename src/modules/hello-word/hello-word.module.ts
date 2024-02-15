import { Module } from '@nestjs/common';
import { HelloWordResolver } from './hello-word.resolver';

@Module({
  providers: [HelloWordResolver]
})
export class HelloWordModule {}
