import { mongoose, MongooseConnection, Repository } from '@gabliam/mongoose';
import {
  Delete,
  Get,
  noContent,
  Post,
  RequestBody,
  RequestParam,
  ResponseEntity,
  RestController,
  Validate,
} from '@gabliam/web-core';
import * as Boom from 'boom';
import { Hero } from '../entities/hero';
import { Joi } from '@gabliam/core/src';

@RestController('/heroes')
export class HeroController {
  private heroRepository: Repository<Hero>;

  constructor(connection: MongooseConnection) {
    this.heroRepository = connection.getRepository<Hero>('Hero');
  }

  @Validate({
    validator: {
      body: Joi.object().keys({
        name: Joi.string().required(),
      }),
    },
    options: { allowUnknown: true },
  })
  @Post('/')
  async create(@RequestBody() hero: Hero) {
    try {
      return await this.heroRepository.create(hero);
    } catch (error) {
      if (error instanceof mongoose.Error) {
        const message = error.message;
        return new ResponseEntity(
          { statusCode: 400, error: 'Bad Request', message },
          400
        );
      }
      throw Boom.internal(error);
    }
  }

  @Delete('/:id')
  async del(@RequestParam('id') id: string) {
    await this.heroRepository.delete(id);
    return noContent();
  }

  @Get('/:id')
  async getById(@RequestParam('id') id: string) {
    const hero = await this.heroRepository.findById(id);
    if (hero) {
      return hero;
    }
    throw Boom.notFound();
  }

  @Get('/')
  async getAll() {
    const photos = await this.heroRepository.find({});
    if (photos.length > 0) {
      return photos;
    }
    throw Boom.notFound();
  }
}
