import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

//import { User } from 'users/entities/user.entity';

export default class UsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log(dataSource);
    /*const userRepository = dataSource.getRepository(User);
    const data = [{
      name: 'Eduardo General',
      email: 'eduardo-general@hotmail.com',
      password: '123',
      role: ROLE_GENERAL,
      manufacturingPlants: [cuautitlan, tepotzotlan, manizales, barranquilla],
      zones: [],
    }];

    for (let i = 0; i < data.length; i++) {
      const dataCurrent = data[i];

      const user = await userRepository.findOneBy({ email: dataCurrent.email });

      if (!user) {
        const userCreate = await userRepository.create(dataCurrent);
        await userRepository.save(userCreate);
      }
    }*/
  }
}
