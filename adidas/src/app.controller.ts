import {
  LoggerService,
  Span,
  TraceService,
} from '@metinseylan/nestjs-opentelemetry';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiGatewayTimeoutResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiOperation,
  ApiParam,
  ApiPayloadTooLargeResponse,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AppService } from './app.service';
import { ApiPaginatedResponse, Paginated } from './models/paginated';
import { Subscription } from './models/subscription';

// eslint-disable-next-line prettier/prettier
@Controller('subscriptions')
@ApiTags('Subscriptions')
@ApiExtraModels(Paginated)
@UseGuards(AuthGuard('api-key'))
@ApiSecurity('ApiKeyAuth')
@ApiForbiddenResponse({ description: 'Operation Forbidden.' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiNotAcceptableResponse({ description: 'The consent property must be true' })
@ApiRequestTimeoutResponse({ description: 'Server Timeout.' })
@ApiPayloadTooLargeResponse({ description: 'Payload too large.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
@ApiGatewayTimeoutResponse({ description: 'Gateway timeout.' })
@ApiHeader({
  name: 'X-API-KEY',
  description: 'API Access Key Test - 1ab2c3d4e5f61ab2c3d4e5f6',
})
export class AppController {
  NOT_ALLOWED_USER_MESSAGE = 'The consent property must be true.';

  constructor(
    private readonly subscriptionService: AppService,
    private readonly traceService: TraceService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('Initialised...', AppController.name);
  }

  @Post('/')
  @ApiOperation({
    description: 'Create a new subscription',
    operationId: 'create',
  })
  @ApiBody({ type: Subscription })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => Subscription,
  })
  @Span()
  create(@Body() subscription: Subscription) {
    const toCreate = plainToClass(Subscription, subscription);
    if (!toCreate.consent) {
      throw new HttpException(
        this.NOT_ALLOWED_USER_MESSAGE,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return toCreate;
  }

  @Get('/')
  @ApiOperation({
    description: 'Find all subscriptions.',
    operationId: 'findAll',
  })
  @ApiPaginatedResponse(Subscription)
  @Span()
  async findAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ): Promise<Paginated<Subscription>> {
    const currentSpan = this.traceService.getSpan();

    //TODO: ADD DB INSERT
    const subscriptions = [
      {
        id: 1234,
        email: 'bob@ibm.com',
        firstname: 'bob',
        gender: 'male',
        dateOfBirth: new Date('1999-10-20'),
        consent: true,
        newsletterId: 123456787,
      },
    ];
    currentSpan.addEvent('Validated');
    currentSpan.end();

    const span = this.traceService.startSpan('DB Find All');
    const results = { total: 50, rows: subscriptions }; // await this.subscriptionService.findAll(offset, limit);
    span.end();
    return {
      total: results.total,
      limit,
      offset,
      results: results.rows,
    };
  }

  @ApiOperation({
    description: "Find a subscription by it's identifier",
    operationId: 'findOne',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'An integer for the subscription identifier',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription was found.',
    type: () => Subscription,
  })
  @Get(':id')
  async findOne(@Param() id: number): Promise<Subscription> {
    return this.subscriptionService.getOne(id);
  }

  @ApiOperation({
    description: "Update a subscription by it's identifier",
    operationId: 'update',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'An integer for the subscription identifier',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription was found.',
    type: () => Subscription,
  })
  @Patch(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() subscription: Subscription,
  ) {
    const toUpdate = plainToClass(Subscription, subscription);
    if (!toUpdate.consent) {
      throw new HttpException(
        this.NOT_ALLOWED_USER_MESSAGE,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    toUpdate.id = id;
    const updated = await this.subscriptionService.update(toUpdate);
    if (!updated) {
      throw new HttpException(
        this.NOT_ALLOWED_USER_MESSAGE,
        HttpStatus.FORBIDDEN,
      );
    }
    return updated;
  }

  @ApiOperation({
    description: "Delete a subscription by it's identifier",
    operationId: 'delete',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'An integer for the subscription identifier',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription was deleted.',
    type: () => Subscription,
  })
  @Delete(':id')
  async deleteCustomer(@Param('id') id: number): Promise<number> {
    const deleted = await this.subscriptionService.delete(id);
    if (!deleted)
      throw new HttpException(
        this.NOT_ALLOWED_USER_MESSAGE,
        HttpStatus.NOT_FOUND,
      );

    return deleted;
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('as-form-data')
  @ApiOperation({
    summary: 'Create subscription with HTML form',
    operationId: 'HTML form POST',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createAsFormData(
    @Body() subscription: Subscription,
  ): Promise<Subscription> {
    return this.subscriptionService.create(subscription);
  }
}
