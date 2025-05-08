import { CredentialsDto } from '../../auth/dtos/credentials.dto';
import { WanderLuxValidationPipe } from '../pipes/wanderlux-validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

const pipe = new WanderLuxValidationPipe();

describe('credentials', () => {
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CredentialsDto,
  };

  it('does not throw on valid dto', () => {
    const credentials: CredentialsDto = {
      email: 'example@email.com',
      password: 'strongPASSWORD123!',
    };

    expect(() => pipe.transform(credentials, metadata)).not.toThrow(
      BadRequestException,
    );
  });

  it('throws error on invalid email', async () => {
    const credentials: CredentialsDto = {
      email: 'email',
      password: 'strongPASSWORD123!',
    };

    await pipe
      .transform(credentials, metadata)
      .catch((err: BadRequestException) => {
        expect(err.message).toBe('Email has an invalid format');
      });
  });

  it('throws error on invalid password', async () => {
    const credentials: CredentialsDto = {
      email: 'example@email.com',
      password: 'weakpw',
    };

    await pipe
      .transform(credentials, metadata)
      .catch((err: BadRequestException) => {
        expect(err.message).toBe('Password is not strong enough');
      });
  });
});
