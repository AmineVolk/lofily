import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { GetTask } from '@/Dto/Tasks/GetTask.dto';
import { TasksApi } from '@/services/api/TasksApi';

const EMPTY_TASK = { title: '', done: false };

const TimerTask = () => {
  const { t } = useTranslation('common');
  const [tasks, setTasks] = useState<GetTask[] | []>([]);

  useEffect(() => {
    TasksApi.getAllUserTasks().then((data) => setTasks(data));
  }, []);

  const handleTaskDone = (index: number) => () => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const onTaskTilteChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index].title = value;
    setTasks(newTasks);
  };

  const handleSave = () => {
    return TasksApi.save(EMPTY_TASK).then(({ data }) =>
      setTasks([...tasks, data])
    );
  };

  const handleEdit = (index: number) => {
    const task = tasks.find((_, i) => i === index);
    if (task) return TasksApi.update(task);
  };

  const handleDelete = (index: number) => () => {
    const task = tasks.find((_, i) => i === index);
    if (task?.id) {
      return TasksApi.remove(task.id).then(() => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
      });
    }
  };

  return (
    <div>
      <button
        className='w-full rounded-md  border border-primary-light py-2 text-secondary-base'
        onClick={handleSave}
      >
        <Trans i18nKey='timer.add_task' />
      </button>
      <div className='mt-4 flex  flex-col space-y-4'>
        {tasks?.map((task, i) => (
          <div
            key={i}
            className={clsx([
              'flex rounded-md border border-primary-light p-3',
              task.done && 'opacity-50',
            ])}
          >
            <input
              className='flex flex-1 border-0 bg-primary-dark text-gray-500 outline-none'
              value={task.title}
              placeholder={t('timer.neew_task_placeholder') + (i + 1)}
              autoFocus
              onChange={(e) => onTaskTilteChange(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEdit(i);
                }
              }}
            />
            <div className='ml-2 flex justify-end space-x-2'>
              <button onClick={handleDelete(i)}>
                <Image
                  src='/images/timer/delete.svg'
                  alt='remove task'
                  width={24}
                  height={24}
                />
              </button>

              <div className='flex items-center'>
                <button
                  className={clsx([
                    'relative h-5 w-5 rounded-[3px]',
                    task.done
                      ? 'border-0 bg-secondary-base'
                      : 'border-2 border-[#918A92] bg-primary-dark',
                  ])}
                  onClick={handleTaskDone(i)}
                >
                  {task.done && (
                    <Image
                      src='/images/timer/checked.svg'
                      width={10}
                      height={8}
                      alt='task done'
                      className='absolute left-1  bottom-[6px]'
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export { TimerTask };
