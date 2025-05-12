import {
  invalidEmail,
  invalidPassword,
  validEmail,
  validPassword,
} from 'src/user/tests/__mocks__/user.testdata';
import { AuthRequestDto } from '../../auth/dtos/auth-request.dto';
import { WanderLuxValidationPipe } from '../pipes/wanderlux-validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

const pipe = new WanderLuxValidationPipe();

describe('credentials', () => {
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: AuthRequestDto,
  };

  it('does not throw on valid dto', () => {
    const credentials: AuthRequestDto = {
      email: validEmail,
      password: validPassword,
    };

    expect(() => pipe.transform(credentials, metadata)).not.toThrow(
      BadRequestException,
    );
  });

  it('throws error on invalid email', async () => {
    const credentials: AuthRequestDto = {
      email: invalidEmail,
      password: validPassword,
    };

    await pipe
      .transform(credentials, metadata)
      .catch((err: BadRequestException) => {
        expect(err.message).toBe('Email has an invalid format');
      });
  });

  it('throws error on invalid password', async () => {
    const credentials: AuthRequestDto = {
      email: validEmail,
      password: invalidPassword,
    };

    await pipe
      .transform(credentials, metadata)
      .catch((err: BadRequestException) => {
        expect(err.message).toBe('Password is not strong enough');
      });
  });
});
