import { Body, Controller , Get, HttpCode, HttpStatus, Post, Query ,Patch ,Param ,} from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AgentsService } from "./agents.service";

@Controller('agents')
@ApiTags('agents')
export class AgentsController {
  readonly #_service: AgentsService;
  constructor(service: AgentsService) {
    this.#_service = service;
  }


  @Get('one')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()

  async findOneAgent(
    @Query('login') login: string
  ) {
    return await this.#_service.findOneAgent(login);
  }



  @Get('writeNewGraph-or-update')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeNewGraph() {
    return await this.#_service.writeNewGraph();
  }

  @Get('writeIp-adress-or-update')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeIpAddress() {
    return await this.#_service.writeIpAdress();
  }
}
