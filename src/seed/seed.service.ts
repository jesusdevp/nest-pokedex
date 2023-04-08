import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-api.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

    constructor(
      @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  
    ) {}

  
  async executeSeed () {

    await this.pokemonModel.deleteMany({}) // delete * from pokemons

    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=10`)

    const pokemonToInsert: {name: string, no: number}[] = []

    // const insertPromisesArray = []

    data.results.forEach( async ({name, url}) => {

      const segments = url.split('/')

      const no = +segments[ segments.length - 2 ]

      pokemonToInsert.push({ name, no })

      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no })
      // )

    })

    // await Promise.all( insertPromisesArray )

    await this.pokemonModel.insertMany( pokemonToInsert )

    return `Seed executed`

  }

}
