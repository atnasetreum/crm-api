import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginAuthInput } from './inputs/login-auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  login(@Args('createAuthInput') loginAuthInput: LoginAuthInput) {
    return this.authService.login(loginAuthInput);
  }
}
