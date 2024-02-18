import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesService } from './categories/categories.service';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { DestinationsModule } from './destinations/destinations.module';
import { DestinationsService } from './destinations/destinations.service';
import { EmailService } from './email/MailerService';
import { HelpersService } from './helpers/Helpers';
import { ImageUploadsService } from './image-uploads/ImageUploadsService';
import { PartnersModule } from './partners/partners.module';
import { PartnersService } from './partners/partners.service';
import { PrismaService } from './prisma.service';
import { ResponseService } from './response.service';
import { ReviewsModule } from './reviews/reviews.module';
import { SentryErrorHandler } from './sentry/sentry-error-handler';
import { SentryModule } from './sentry/sentry.module';
import { SentryService } from './sentry/sentry.service';
import { SocialLinksModule } from './social-links/social-links.module';
import { TripPhotosModule } from './trip-photos/trip-photos.module';
import { TripPhotosService } from './trip-photos/trip-photos.service';
import { TripsModule } from './trips/trips.module';
import { TripsService } from './trips/trips.service';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UserRolesService } from './user-roles/user-roles.service';
import { UserModule } from './user/user.module';

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
    UserRolesService,
    CategoriesService,
    DestinationsService,
    PartnersService,
    TripsService,
    TripPhotosService,
    PrismaService,
    ResponseService,
    HelpersService,
    ImageUploadsService,
    { provide: 'ErrorHandlerAPI', useClass: SentryErrorHandler },
  ],
})
export class AppModule {}
