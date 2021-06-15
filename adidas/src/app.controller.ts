import { Span, TraceService } from '@metinseylan/nestjs-opentelemetry';
import { LoggerService } from '@metinseylan/nestjs-opentelemetry';
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
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiGatewayTimeoutResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiPayloadTooLargeResponse,
    ApiRequestTimeoutResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { ApiPaginatedResponse, Paginated } from './models/paginated';
import { Subscription } from './models/subscription';

const Hashids = require('hashids');
const { tracer } = require('utils/tracing');

@Controller('subscriptions')
@ApiTags('Subscriptions')
@ApiExtraModels(Paginated)
@UseGuards(AuthGuard('api-key'))
@ApiSecurity('ApiKeyAuth')

@ApiForbiddenResponse({ description: 'Operation Forbidden.' })
@ApiBadRequestResponse({ description: 'Bad Request.' })
@ApiRequestTimeoutResponse({ description: 'Server Timeout.' })
@ApiPayloadTooLargeResponse({ description: 'Payload too large.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
@ApiGatewayTimeoutResponse({ description: 'Gateway timeout.' })

export class AppController {

    const NOT_ALLOWED_USER_MESSAGE = 'Operation not allowed by user.';

    constructor(
        private readonly appService: AppService,
        private readonly traceService: TraceService,
        private readonly logger: LoggerService) {
        this.logger.log(
            'Initialised...',
            AppController.name,
        );
    }

    @Post('/')
    @ApiOperation({ description: 'Create a new subscription', operationId: 'create' })
    @ApiBody({ type: Subscription })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: () => Subscription
    })
    @Span()
    create(@Body() subscription: Subscription) {
        return subscription;
    }


    @Get('/')
    @ApiOperation({ description: 'Find all subscriptions.', operationId: 'findAll' })
    @ApiPaginatedResponse(Subscription)
    @Span()
    async findAll(@Query() limit: number = 10, @Query() offset: number = 0): Promise<Paginated<Subscription>> {
        const currentSpan = this.traceService.getSpan();

        //TODO: ADD DB INSERT
        const subscriptions = [{
            id: '1234',
            email: 'bob@ibm.com',
            firstname: 'bob',
            gender: 'male',
            dateOfBirth: '1999-10-20',
            consent: true,
            newsletterId: '123456787',
        }];
        currentSpan.addEvent('Validated');
        currentSpan.end();

        const span = this.traceService.startSpan('DB Find All');
        const results = await this.subscriptionService.findAll(offset, limit);
        span.end();
        return {
            total: results.total,
            limit,
            offset,
            results results.rows,
        };

    }


    @ApiOperation({ description: 'Find a subscription by it\'s identifier', operationId: 'findOne' })
    @ApiResponse({
        status: 200,
        description: 'The subscription was found.',
        type: () => Subscription
    })
    @Get('/:id')
    findOne(@Param('id') id: string): Promise<Subscription> {
        return this.subscriptionService.findOne(+id);
    }

    @Patch('/:id')
    async updateCustomer(@Body() subscription: Subscription, @Param("id") id: number) {
        const updated = await this.subscriptionService.updateANote(id, subscription);
        if (!updated)
            throw new HttpException(this.NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
        return updated;
    }

    @Delete('/id')
    async deleteCustomer(@Param('id') id): Promise<Subscription> {
        const deleted = await this.subscriptionService.delete(id);
        if (!deleted)
            throw new HttpException(this.NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
        return deleted;
    }

    @ApiConsumes('application/x-www-form-urlencoded')
    @Post('as-form-data')
    @ApiOperation({ summary: 'Create subscription with HTML form', operationId: 'HTML form POST' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createAsFormData(@Body() subscription: Subscription): Promise<Subscription> {
        return this.subscriptionService.create(subscription);
    }

}


function encode(item) {
    return {
        ...item,
        id: hash.encode(item.id),
        newsletterId: hash.encode(item.newsletterId),
    };
}

function encodeArray(items) {
    return items.map(encode);
}

function decode(item) {
    return {
        ...item,
        id: hash.decode(item.id),
        newsletterId: hash.decode(item.newsletterId),
    };
}
