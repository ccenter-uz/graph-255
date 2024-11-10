import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { AgentsDateEntity } from 'src/entities/agentsdata.entity';

import { HolidaysEntity } from 'src/entities/holidays.entity';
import { GraphDaysEntity } from 'src/entities/graphDays';
import { GraphMonthEntity } from 'src/entities/graphMoth';

import { returnMothData } from 'src/utils/converters';
import { readSheets } from 'src/utils/google_cloud';
import { Like } from 'typeorm';
import { GraphTypes, WorkTypes } from 'src/types';

@Injectable()
export class AgentsService {
  readonly #_cache: Cache;
  constructor() {}

  async findOneAgent(login: string) {
    console.log(login);
    
    
    const findAgent = await AgentsDateEntity.findOne({
      where: {
        login:login
      },
      relations: {
        months: {
          days:true
        }
      },
      order: {
        months: {
          days: {
            the_date :'asc'
          }
        }
        // create_data: 'DESC',
      },
    })

    if (!findAgent) {
      throw new HttpException('Not Found Agent' , HttpStatus.NOT_FOUND)
    }
    
    return findAgent;
  }



  @Cron('0 0 20 * * *')
  async writeNewGraphlastMonth() {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    if (now.getDate() === lastDay) {
      try {
        const cutRanges = 'A2:AR500';

        // const sheetId: string = '1BF7Z9CTKdL-RvBwzZTcB4gvOqoviX6fUwHIBmSlG_ow';
        const rangeName: string = 'ПРЕДПОЧТЕНИЯ';
        const sheets = await readSheets(rangeName, cutRanges);

        for (const e of sheets) {
          if (e[11] || e[12]) {
            console.log(e[11], e[12]);

            const findAgent: AgentsDateEntity = await AgentsDateEntity.findOne({
              where: {
                login: e[11],
              },
              relations: {
                months: {
                  days: true,
                },
              },
            });

            if (findAgent) {
              const updateAgent = await AgentsDateEntity.createQueryBuilder()
                .update(AgentsDateEntity)
                .set({
                  service_name: e[8],
                  name: e[10],
                  login: e[11],
                  password: e[12],
                  chat_id: e[4],
                  first_number: e[5],
                  secont_number: e[6],
                })
                .where('agent_id = :id', { id: findAgent.agent_id })
                .returning(['agent_id'])
                .execute();

              if (updateAgent) {
                const firstday = e[13].split('/')[0];

                const findMonth = await GraphMonthEntity.findOne({
                  where: {
                    year: firstday.split('.')[2],
                    month_number: firstday.split('.')[1],
                    agent_id: updateAgent.raw[0]?.agent_id,
                  },
                });

                if (findMonth) {
                  const mothData = await returnMothData(firstday);
                  const updateMoth = await GraphMonthEntity.createQueryBuilder()
                    .update(GraphMonthEntity)
                    .set({
                      year: firstday.split('.')[2],
                      month_number: +firstday.split('.')[1],
                      month_name: mothData.name,
                      month_days_count: mothData.days,
                      month_day_off_first: e[1],
                      month_day_off_second: e[2],
                      month_straight: e[3],
                      month_work_time: e[0],
                      agent_id: updateAgent.raw[0].agent_id,
                    })
                    .where('id = :id', { id: findMonth.id })
                    .returning(['id'])
                    .execute()
                    .catch((e) => console.log(e));

                  if (updateMoth) {
                    for (let i = 13; i < e.length; i++) {
                      if (e[i]) {
                        const dataDay = e[i].split('/');

                        const typesGraph = [
                          'DAM',
                          'Н',
                          'К',
                          'Б',
                          'О',
                          'Р',
                          'П',
                          'А',
                          'У',
                        ];
                        const typesTime = [
                          '10-19',
                          '07-16',
                          '08-17',
                          '09-18',
                          '11-20',
                          '13-22',
                          '15-24',
                          '17-02',
                          '07-15',
                          '08-16',
                          '09-17',
                          '08-18',
                          '18-08',
                          '14-23',
                          '18-09',
                          '09-18',
                        ];
                        const typesSmen = ['08-20', '20-08'];

                        const findDay = await GraphDaysEntity.findOne({
                          where: {
                            the_date: dataDay[0],
                            month_id: {
                              id: updateMoth?.raw[0]?.id,
                            },
                          },
                          relations: {
                            month_id: {
                              agent_id: true,
                            },
                          },
                        }).catch((e) => console.log(e));
                        let formatDate = new Date(
                          +dataDay[0]?.split('.')[2],
                          +dataDay[0]?.split('.')[1] - 1,
                          +dataDay[0]?.split('.')[0],
                        );

                        if (findDay) {
                          if (typesGraph.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .update(GraphDaysEntity)
                              .set({
                                at_work: dataDay[1],
                                work_day: +dataDay[0].split('.')[0],
                                work_time: null,
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: dataDay[1],
                                week_day_name: dataDay[2],
                              })
                              .where('id = :id', { id: findDay.id })
                              .returning(['id'])
                              .execute();
                          } else if (typesTime.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .update(GraphDaysEntity)
                              .set({
                                at_work: GraphTypes.Work,
                                work_day: +dataDay[0].split('.')[0],
                                work_time: dataDay[1],
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: WorkTypes.Day,
                                week_day_name: dataDay[2],
                              })
                              .where('id = :id', { id: findDay.id })
                              .returning(['id'])
                              .execute();
                          } else if (typesSmen.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .update(GraphDaysEntity)
                              .set({
                                at_work: GraphTypes.Work,
                                work_day: +dataDay[0].split('.')[0],
                                work_time: dataDay[1],
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: WorkTypes.Smen,
                                week_day_name: dataDay[2],
                              })
                              .where('id = :id', { id: findDay.id })
                              .returning(['id'])
                              .execute();
                          }
                        } else {
                          if (typesGraph.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .insert()
                              .into(GraphDaysEntity)
                              .values({
                                at_work: dataDay[1],
                                work_day: +dataDay[0].split('.')[0],
                                work_time: null,
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: dataDay[1],
                                week_day_name: dataDay[2],
                                month_id: {
                                  id: findMonth?.id,
                                },
                              })
                              .returning(['id'])
                              .execute()
                              .catch((e) => {
                                throw new HttpException(
                                  'Bad Request',
                                  HttpStatus.BAD_REQUEST,
                                );
                              });
                          } else if (typesTime.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .insert()
                              .into(GraphDaysEntity)
                              .values({
                                at_work: GraphTypes.Work,
                                work_day: +dataDay[0].split('.')[0],
                                work_time: dataDay[1],
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: WorkTypes.Day,
                                week_day_name: dataDay[2],
                                month_id: {
                                  id: findMonth?.id,
                                },
                              })
                              .returning(['id'])
                              .execute()
                              .catch((e) => {
                                throw new HttpException(
                                  'Bad Request',
                                  HttpStatus.BAD_REQUEST,
                                );
                              });
                          } else if (typesSmen.includes(dataDay[1])) {
                            await GraphDaysEntity.createQueryBuilder()
                              .insert()
                              .into(GraphDaysEntity)
                              .values({
                                at_work: GraphTypes.Work,
                                work_day: +dataDay[0].split('.')[0],
                                work_time: dataDay[1],
                                the_date: dataDay[0],
                                the_day_Format_Date: formatDate,
                                work_type: WorkTypes.Smen,
                                week_day_name: dataDay[2],
                                month_id: {
                                  id: findMonth?.id,
                                },
                              })
                              .returning(['id'])
                              .execute()
                              .catch((e) => {
                                throw new HttpException(
                                  'Bad Request',
                                  HttpStatus.BAD_REQUEST,
                                );
                              });
                          }
                        }
                      }
                    }
                  }
                } else {
                  const mothData = await returnMothData(firstday);

                  const newMoth = await GraphMonthEntity.createQueryBuilder()
                    .insert()
                    .into(GraphMonthEntity)
                    .values({
                      year: firstday.split('.')[2],
                      month_number: +firstday.split('.')[1],
                      month_name: mothData.name,
                      month_days_count: mothData.days,
                      month_day_off_first: e[1],
                      month_day_off_second: e[2],
                      month_straight: e[3],
                      month_work_time: e[0],
                      agent_id: updateAgent.raw[0].agent_id,
                    })
                    .returning(['id'])
                    .execute()
                    .catch((e) => {
                      throw new HttpException(
                        'Bad Request',
                        HttpStatus.BAD_REQUEST,
                      );
                    });

                  if (newMoth) {
                    for (let i = 13; i < e.length; i++) {
                      if (e[i]) {
                        const dataDay = e[i].split('/');
                        let formatDate = new Date(
                          +dataDay[0]?.split('.')[2],
                          +dataDay[0]?.split('.')[1] - 1,
                          +dataDay[0]?.split('.')[0],
                        );

                        const typesGraph = [
                          'DAM',
                          'Н',
                          'К',
                          'Б',
                          'О',
                          'Р',
                          'П',
                          'А',
                          'У',
                        ];
                        const typesTime = [
                          '10-19',
                          '07-16',
                          '08-17',
                          '09-18',
                          '11-20',
                          '13-22',
                          '15-24',
                          '17-02',
                          '07-15',
                          '08-16',
                          '09-17',
                          '08-18',
                          '18-08',
                          '14-23',
                          '18-09',
                          '09-18',
                        ];
                        const typesSmen = ['08-20', '20-08'];

                        if (typesGraph.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: dataDay[1],
                              work_day: +dataDay[0].split('.')[0],
                              work_time: null,
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: dataDay[1],
                              week_day_name: dataDay[2],
                              month_id: newMoth.raw[0].id,
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        } else if (typesTime.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Day,
                              week_day_name: dataDay[2],
                              month_id: newMoth.raw[0].id,
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        } else if (typesSmen.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Smen,
                              week_day_name: dataDay[2],
                              month_id: newMoth.raw[0].id,
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        }
                      }
                    }
                  }
                }
              }
            } else {
              // agent else

              const newAgent = await AgentsDateEntity.createQueryBuilder()
                .insert()
                .into(AgentsDateEntity)
                .values({
                  service_name: e[8],
                  name: e[10],
                  login: e[11],
                  password: e[12],
                  chat_id: e[4],
                  first_number: e[5],
                  secont_number: e[6],
                })
                .returning(['agent_id'])
                .execute()
                .catch((e) => {
                  throw new HttpException(
                    'Bad Request',
                    HttpStatus.BAD_REQUEST,
                  );
                });

              if (newAgent) {
                const firstday = e[13].split('/')[0];

                const mothData = await returnMothData(firstday);
                const newMoth = await GraphMonthEntity.createQueryBuilder()
                  .insert()
                  .into(GraphMonthEntity)
                  .values({
                    year: firstday.split('.')[2],
                    month_number: +firstday.split('.')[1],
                    month_name: mothData.name,
                    month_days_count: mothData.days,
                    month_day_off_first: e[1],
                    month_day_off_second: e[2],
                    month_straight: e[3],
                    month_work_time: e[0],
                    agent_id: newAgent.raw[0].agent_id,
                  })
                  .returning(['id'])
                  .execute()
                  .catch((e) => {
                    throw new HttpException(
                      'Bad Request',
                      HttpStatus.BAD_REQUEST,
                    );
                  });

                if (newMoth) {
                  for (let i = 13; i < e.length; i++) {
                    if (e[i]) {
                      const dataDay = e[i].split('/');
                      let formatDate = new Date(
                        +dataDay[0]?.split('.')[2],
                        +dataDay[0]?.split('.')[1] - 1,
                        +dataDay[0]?.split('.')[0],
                      );

                      const typesGraph = [
                        'DAM',
                        'Н',
                        'К',
                        'Б',
                        'О',
                        'Р',
                        'П',
                        'А',
                        'У',
                      ];
                      const typesTime = [
                        '10-19',
                        '07-16',
                        '08-17',
                        '09-18',
                        '11-20',
                        '13-22',
                        '15-24',
                        '17-02',
                        '07-15',
                        '08-16',
                        '09-17',
                        '08-18',
                        '18-08',
                        '14-23',
                        '18-09',
                        '09-18',
                      ];
                      const typesSmen = ['08-20', '20-08'];
                      // console.log(dataDay[1] , dataDay , firstday );
                      //

                      if (typesGraph.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: dataDay[1],
                            work_day: +dataDay[0].split('.')[0],
                            work_time: null,
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: dataDay[1],
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      } else if (typesTime.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: GraphTypes.Work,
                            work_day: +dataDay[0].split('.')[0],
                            work_time: dataDay[1],
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: WorkTypes.Day,
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      } else if (typesSmen.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: GraphTypes.Work,
                            work_day: +dataDay[0].split('.')[0],
                            work_time: dataDay[1],
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: WorkTypes.Smen,
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return true;
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async writeNewGraph() {
    try {
      const cutRanges = 'A2:AR500';

      // const sheetId: string = '1BF7Z9CTKdL-RvBwzZTcB4gvOqoviX6fUwHIBmSlG_ow';
      const rangeName: string = 'ПРЕДПОЧТЕНИЯ';
      const sheets = await readSheets(rangeName, cutRanges);

      for (const e of sheets) {
        if (e[11] || e[12]) {
          console.log(e[11], e[12]);

          const findAgent: AgentsDateEntity = await AgentsDateEntity.findOne({
            where: {
              login: e[11],
            },
            relations: {
              months: {
                days: true,
              },
            },
          });

          if (findAgent) {
            const updateAgent = await AgentsDateEntity.createQueryBuilder()
              .update(AgentsDateEntity)
              .set({
                service_name: e[8],
                name: e[10],
                login: e[11],
                password: e[12],
                chat_id: e[4],
                first_number: e[5],
                secont_number: e[6],
              })
              .where('agent_id = :id', { id: findAgent.agent_id })
              .returning(['agent_id'])
              .execute();

            if (updateAgent) {
              const firstday = e[13].split('/')[0];

              const findMonth = await GraphMonthEntity.findOne({
                where: {
                  year: firstday.split('.')[2],
                  month_number: firstday.split('.')[1],
                  agent_id: updateAgent.raw[0]?.agent_id,
                },
              });

              if (findMonth) {
                const mothData = await returnMothData(firstday);
                const updateMoth = await GraphMonthEntity.createQueryBuilder()
                  .update(GraphMonthEntity)
                  .set({
                    year: firstday.split('.')[2],
                    month_number: +firstday.split('.')[1],
                    month_name: mothData.name,
                    month_days_count: mothData.days,
                    month_day_off_first: e[1],
                    month_day_off_second: e[2],
                    month_straight: e[3],
                    month_work_time: e[0],
                    agent_id: updateAgent.raw[0].agent_id,
                  })
                  .where('id = :id', { id: findMonth.id })
                  .returning(['id'])
                  .execute()
                  .catch((e) => console.log(e));

                if (updateMoth) {
                  for (let i = 13; i < e.length; i++) {
                    if (e[i]) {
                      const dataDay = e[i].split('/');

                      const typesGraph = [
                        'DAM',
                        'Н',
                        'К',
                        'Б',
                        'О',
                        'Р',
                        'П',
                        'А',
                        'У',
                      ];
                      const typesTime = [
                        '10-19',
                        '07-16',
                        '08-17',
                        '09-18',
                        '11-20',
                        '13-22',
                        '15-24',
                        '17-02',
                        '07-15',
                        '08-16',
                        '09-17',
                        '08-18',
                        '18-08',
                        '14-23',
                        '18-09',
                        '09-18',
                      ];
                      const typesSmen = ['08-20', '20-08'];

                      const findDay = await GraphDaysEntity.findOne({
                        where: {
                          the_date: dataDay[0],
                          month_id: {
                            id: updateMoth?.raw[0]?.id,
                          },
                        },
                        relations: {
                          month_id: {
                            agent_id: true,
                          },
                        },
                      }).catch((e) => console.log(e));
                      let formatDate = new Date(
                        +dataDay[0]?.split('.')[2],
                        +dataDay[0]?.split('.')[1] - 1,
                        +dataDay[0]?.split('.')[0],
                      );

                      if (findDay) {
                        if (typesGraph.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .update(GraphDaysEntity)
                            .set({
                              at_work: dataDay[1],
                              work_day: +dataDay[0].split('.')[0],
                              work_time: null,
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: dataDay[1],
                              week_day_name: dataDay[2],
                            })
                            .where('id = :id', { id: findDay.id })
                            .returning(['id'])
                            .execute();
                        } else if (typesTime.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .update(GraphDaysEntity)
                            .set({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Day,
                              week_day_name: dataDay[2],
                            })
                            .where('id = :id', { id: findDay.id })
                            .returning(['id'])
                            .execute();
                        } else if (typesSmen.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .update(GraphDaysEntity)
                            .set({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Smen,
                              week_day_name: dataDay[2],
                            })
                            .where('id = :id', { id: findDay.id })
                            .returning(['id'])
                            .execute();
                        }
                      } else {
                        if (typesGraph.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: dataDay[1],
                              work_day: +dataDay[0].split('.')[0],
                              work_time: null,
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: dataDay[1],
                              week_day_name: dataDay[2],
                              month_id: {
                                id: findMonth?.id,
                              },
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        } else if (typesTime.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Day,
                              week_day_name: dataDay[2],
                              month_id: {
                                id: findMonth?.id,
                              },
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        } else if (typesSmen.includes(dataDay[1])) {
                          await GraphDaysEntity.createQueryBuilder()
                            .insert()
                            .into(GraphDaysEntity)
                            .values({
                              at_work: GraphTypes.Work,
                              work_day: +dataDay[0].split('.')[0],
                              work_time: dataDay[1],
                              the_date: dataDay[0],
                              the_day_Format_Date: formatDate,
                              work_type: WorkTypes.Smen,
                              week_day_name: dataDay[2],
                              month_id: {
                                id: findMonth?.id,
                              },
                            })
                            .returning(['id'])
                            .execute()
                            .catch((e) => {
                              throw new HttpException(
                                'Bad Request',
                                HttpStatus.BAD_REQUEST,
                              );
                            });
                        }
                      }
                    }
                  }
                }
              } else {
                const mothData = await returnMothData(firstday);

                const newMoth = await GraphMonthEntity.createQueryBuilder()
                  .insert()
                  .into(GraphMonthEntity)
                  .values({
                    year: firstday.split('.')[2],
                    month_number: +firstday.split('.')[1],
                    month_name: mothData.name,
                    month_days_count: mothData.days,
                    month_day_off_first: e[1],
                    month_day_off_second: e[2],
                    month_straight: e[3],
                    month_work_time: e[0],
                    agent_id: updateAgent.raw[0].agent_id,
                  })
                  .returning(['id'])
                  .execute()
                  .catch((e) => {
                    throw new HttpException(
                      'Bad Request',
                      HttpStatus.BAD_REQUEST,
                    );
                  });

                if (newMoth) {
                  for (let i = 13; i < e.length; i++) {
                    if (e[i]) {
                      const dataDay = e[i].split('/');
                      let formatDate = new Date(
                        +dataDay[0]?.split('.')[2],
                        +dataDay[0]?.split('.')[1] - 1,
                        +dataDay[0]?.split('.')[0],
                      );

                      const typesGraph = [
                        'DAM',
                        'Н',
                        'К',
                        'Б',
                        'О',
                        'Р',
                        'П',
                        'А',
                        'У',
                      ];
                      const typesTime = [
                        '10-19',
                        '07-16',
                        '08-17',
                        '09-18',
                        '11-20',
                        '13-22',
                        '15-24',
                        '17-02',
                        '07-15',
                        '08-16',
                        '09-17',
                        '08-18',
                        '18-08',
                        '14-23',
                        '18-09',
                        '09-18',
                      ];
                      const typesSmen = ['08-20', '20-08'];

                      if (typesGraph.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: dataDay[1],
                            work_day: +dataDay[0].split('.')[0],
                            work_time: null,
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: dataDay[1],
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      } else if (typesTime.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: GraphTypes.Work,
                            work_day: +dataDay[0].split('.')[0],
                            work_time: dataDay[1],
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: WorkTypes.Day,
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      } else if (typesSmen.includes(dataDay[1])) {
                        await GraphDaysEntity.createQueryBuilder()
                          .insert()
                          .into(GraphDaysEntity)
                          .values({
                            at_work: GraphTypes.Work,
                            work_day: +dataDay[0].split('.')[0],
                            work_time: dataDay[1],
                            the_date: dataDay[0],
                            the_day_Format_Date: formatDate,
                            work_type: WorkTypes.Smen,
                            week_day_name: dataDay[2],
                            month_id: newMoth.raw[0].id,
                          })
                          .returning(['id'])
                          .execute()
                          .catch((e) => {
                            throw new HttpException(
                              'Bad Request',
                              HttpStatus.BAD_REQUEST,
                            );
                          });
                      }
                    }
                  }
                }
              }
            }
          } else {
            // agent else

            const newAgent = await AgentsDateEntity.createQueryBuilder()
              .insert()
              .into(AgentsDateEntity)
              .values({
                service_name: e[8],
                name: e[10],
                login: e[11],
                password: e[12],
                chat_id: e[4],
                first_number: e[5],
                secont_number: e[6],
              })
              .returning(['agent_id'])
              .execute()
              .catch((e) => {
                throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
              });

            if (newAgent) {
              const firstday = e[13].split('/')[0];

              const mothData = await returnMothData(firstday);
              const newMoth = await GraphMonthEntity.createQueryBuilder()
                .insert()
                .into(GraphMonthEntity)
                .values({
                  year: firstday.split('.')[2],
                  month_number: +firstday.split('.')[1],
                  month_name: mothData.name,
                  month_days_count: mothData.days,
                  month_day_off_first: e[1],
                  month_day_off_second: e[2],
                  month_straight: e[3],
                  month_work_time: e[0],
                  agent_id: newAgent.raw[0].agent_id,
                })
                .returning(['id'])
                .execute()
                .catch((e) => {
                  throw new HttpException(
                    'Bad Request',
                    HttpStatus.BAD_REQUEST,
                  );
                });

              if (newMoth) {
                for (let i = 13; i < e.length; i++) {
                  if (e[i]) {
                    const dataDay = e[i].split('/');
                    let formatDate = new Date(
                      +dataDay[0]?.split('.')[2],
                      +dataDay[0]?.split('.')[1] - 1,
                      +dataDay[0]?.split('.')[0],
                    );

                    const typesGraph = [
                      'DAM',
                      'Н',
                      'К',
                      'Б',
                      'О',
                      'Р',
                      'П',
                      'А',
                      'У',
                    ];
                    const typesTime = [
                      '10-19',
                      '07-16',
                      '08-17',
                      '09-18',
                      '11-20',
                      '13-22',
                      '15-24',
                      '17-02',
                      '07-15',
                      '08-16',
                      '09-17',
                      '08-18',
                      '18-08',
                      '14-23',
                      '18-09',
                      '09-18',
                    ];
                    const typesSmen = ['08-20', '20-08'];
                    // console.log(dataDay[1] , dataDay , firstday );
                    //

                    if (typesGraph.includes(dataDay[1])) {
                      await GraphDaysEntity.createQueryBuilder()
                        .insert()
                        .into(GraphDaysEntity)
                        .values({
                          at_work: dataDay[1],
                          work_day: +dataDay[0].split('.')[0],
                          work_time: null,
                          the_date: dataDay[0],
                          the_day_Format_Date: formatDate,
                          work_type: dataDay[1],
                          week_day_name: dataDay[2],
                          month_id: newMoth.raw[0].id,
                        })
                        .returning(['id'])
                        .execute()
                        .catch((e) => {
                          throw new HttpException(
                            'Bad Request',
                            HttpStatus.BAD_REQUEST,
                          );
                        });
                    } else if (typesTime.includes(dataDay[1])) {
                      await GraphDaysEntity.createQueryBuilder()
                        .insert()
                        .into(GraphDaysEntity)
                        .values({
                          at_work: GraphTypes.Work,
                          work_day: +dataDay[0].split('.')[0],
                          work_time: dataDay[1],
                          the_date: dataDay[0],
                          the_day_Format_Date: formatDate,
                          work_type: WorkTypes.Day,
                          week_day_name: dataDay[2],
                          month_id: newMoth.raw[0].id,
                        })
                        .returning(['id'])
                        .execute()
                        .catch((e) => {
                          throw new HttpException(
                            'Bad Request',
                            HttpStatus.BAD_REQUEST,
                          );
                        });
                    } else if (typesSmen.includes(dataDay[1])) {
                      await GraphDaysEntity.createQueryBuilder()
                        .insert()
                        .into(GraphDaysEntity)
                        .values({
                          at_work: GraphTypes.Work,
                          work_day: +dataDay[0].split('.')[0],
                          work_time: dataDay[1],
                          the_date: dataDay[0],
                          the_day_Format_Date: formatDate,
                          work_type: WorkTypes.Smen,
                          week_day_name: dataDay[2],
                          month_id: newMoth.raw[0].id,
                        })
                        .returning(['id'])
                        .execute()
                        .catch((e) => {
                          throw new HttpException(
                            'Bad Request',
                            HttpStatus.BAD_REQUEST,
                          );
                        });
                    }
                  }
                }
              }
            }
          }
        }
      }
      return true;
    } catch (error) {
      console.log(error.message);
    }
  }

  // @Cron('0 0 1 * *')
  async writeIpAdress() {
    const cutRanges = 'A2:D999';
    // const sheetId: string = '1BF7Z9CTKdL-RvBwzZTcB4gvOqoviX6fUwHIBmSlG_ow';
    const rangeName: string = 'ПРЕДПОЧТЕНИЯ21';
    const sheets = await readSheets(rangeName, cutRanges);

    for (const e of sheets) {
      if (e[0]) {
        const findComp = await HolidaysEntity.findOne({
          where: {
            sheet_id: e[0],
          },
        });

        if (findComp) {
          await HolidaysEntity.update(findComp.id, {
            sheet_id: e[0],
            // ip_Adress: e[1],
            // location: e[2],
            // atc: e[3],
          });
        } else {
          await HolidaysEntity.createQueryBuilder()
            .insert()
            .into(HolidaysEntity)
            .values({
              sheet_id: e[0],
              // ip_Adress: e[1],
              // location: e[2],
              // atc: e[3],
            })
            .execute()
            // .catch((e) => {
            //   throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            // });
        }
      }
    }
  }
}
