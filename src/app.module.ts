import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { DestinationsModule } from './destinations/destinations.module';
import { EmailService } from './email/MailerService';
import { PartnersModule } from './partners/partners.module';
import { SentryErrorHandler } from './sentry/sentry-error-handler';
import { SentryModule } from './sentry/sentry.module';
import { SentryService } from './sentry/sentry.service';
import { SocialLinksModule } from './social-links/social-links.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UserModule } from './user/user.module';
import { TripsModule } from './trips/trips.module';
import { TripPhotosModule } from './trip-photos/trip-photos.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      },
    }),
    

    UserModule,
    AuthModule,
    SentryModule,
    UserRolesModule,
    ContactInfoModule,
    SocialLinksModule,
    DestinationsModule,
    CategoriesModule,
    PartnersModule,
    TripsModule,
    TripPhotosModule,
    ReviewsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    SentryService,
    { provide: 'ErrorHandlerAPI', useClass: SentryErrorHandler },
  ],
})
export class AppModule {}
