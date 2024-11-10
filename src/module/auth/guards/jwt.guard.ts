import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class jwtGuard extends AuthGuard('jwt') {}
