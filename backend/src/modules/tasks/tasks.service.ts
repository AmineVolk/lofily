import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  async checkUserTaskAccess(tasksid: number) {
    const { userId } = this.request;

    const task = await this.tasksRepository.query(
      `
        SELECT * FROM tasks WHERE id=$1 and userid = $2
      `,
      [tasksid, userId],
    );
    if (!task.length) {
      throw new ForbiddenException('Resource not allowed');
    }
  }

  create(createTaskDto: CreateTaskDto) {
    const { userId } = this.request;
    console.log(`--- userId ${JSON.stringify(userId, null, 2)}`);

    return this.tasksRepository.save({
      ...createTaskDto,
      userid: parseInt(userId),
    });
  }

  async findAllUserTasks() {
    const { userId } = this.request;
    const tasks = await this.tasksRepository.query(
      `
      select *
      from tasks 
      where userid = $1
      order by id
      limit 10
    `,
      [userId],
    );

    return tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.checkUserTaskAccess(id);
    return this.tasksRepository.update(id, updateTaskDto);
  }

  async remove(id: number) {
    await this.checkUserTaskAccess(id);
    return this.tasksRepository.delete(+id);
  }
}
