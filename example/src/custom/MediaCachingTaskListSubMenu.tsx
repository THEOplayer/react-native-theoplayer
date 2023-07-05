import { CacheTaskStatus, CachingTask, MediaCache, useCachingTaskList, useCachingTaskProgress, useCachingTaskStatus } from 'react-native-theoplayer';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { MenuRadioButton, MenuView, ScrollableMenu, SubMenuWithButton } from '@theoplayer/react-native-ui';

export interface MediaCachingTaskListSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

export const MediaCachingTaskListSubMenu = (props: MediaCachingTaskListSubMenuProps) => {
  const { menuStyle } = props;

  const tasks = useCachingTaskList();

  const createMenu = () => {
    return <MediaCachingTaskView style={menuStyle} />;
  };

  return <SubMenuWithButton menuConstructor={createMenu} label={'Media Cache'} preview={`${tasks.length} item(s)`} />;
};

export interface MediaCachingTaskViewProps {
  style?: StyleProp<ViewStyle>;
}

function getCachingTaskLabel(task: CachingTask): string {
  return task.source.metadata?.title || 'Unknown source';
}

const EmptyMediaCacheView = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <MenuRadioButton
        label={'Media cache is empty'}
        uid={0}
        onSelect={() => {
          /**/
        }}
      />
    </View>
  );
};

const TaskItemView = (props: { id: number; task: CachingTask }) => {
  const { task } = props;

  const status = useCachingTaskStatus(task);
  const progress = useCachingTaskProgress(task);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MenuRadioButton
        label={getCachingTaskLabel(task)}
        uid={0}
        onSelect={() => {
          /**/
        }}></MenuRadioButton>
      {status && (
        <MenuRadioButton
          label={`${status}`}
          uid={1}
          onSelect={() => {
            switch (task.status) {
              case CacheTaskStatus.idle:
                task.start();
                break;
              case CacheTaskStatus.loading:
                task.pause();
                break;
            }
          }}
        />
      )}
      {progress && (
        <MenuRadioButton
          label={`${(100 * (progress || 1)).toFixed(2)}%`}
          uid={2}
          onSelect={() => {
            /*ignore*/
          }}
        />
      )}
      {status !== CacheTaskStatus.evicted && (
        <MenuRadioButton
          label={'X'}
          uid={3}
          onSelect={() => {
            task.remove();
          }}></MenuRadioButton>
      )}
    </View>
  );
};

export const MediaCachingTaskView = (props: MediaCachingTaskViewProps) => {
  const tasks = MediaCache.tasks;
  return (
    <MenuView
      style={props.style}
      menu={
        <ScrollableMenu
          title={'Caching Tasks'}
          items={tasks.length === 0 ? <EmptyMediaCacheView /> : tasks.map((task, id) => <TaskItemView key={id} id={id} task={task} />)}
        />
      }
    />
  );
};
