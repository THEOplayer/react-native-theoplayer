import { CacheTaskStatus, CachingTask, MediaCache, useCachingTaskList, useCachingTaskProgress, useCachingTaskStatus } from 'react-native-theoplayer';
import React from 'react';
import { StyleProp, View, ViewStyle, Text } from 'react-native';
import { ActionButton, MenuRadioButton, MenuView, ScrollableMenu, SubMenuWithButton } from '@theoplayer/react-native-ui';
import { DeleteSvg } from "../res/DeleteSvg";

export interface MediaCachingTaskListSubMenuProps {
    /**
     * Overrides for the style of the menu.
     */
    menuStyle?: StyleProp<ViewStyle>;
}

export const MediaCachingTaskListSubMenu = (props: MediaCachingTaskListSubMenuProps) => {
    const {menuStyle} = props;

    const tasks = useCachingTaskList();

    const createMenu = () => {
        return <MediaCachingTaskView style={menuStyle}/>;
    };

    return <SubMenuWithButton menuConstructor={createMenu} label={'Media Cache'} preview={`${tasks.length} item(s)`}/>;
};

export interface MediaCachingTaskViewProps {
    style?: StyleProp<ViewStyle>;
}

function getCachingTaskLabel(task: CachingTask): string {
    return task.source.metadata?.title || task.id.slice(0, 13);
}

const EmptyMediaCacheView = () => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
    const {task} = props;

    const status = useCachingTaskStatus(task);
    const progress = useCachingTaskProgress(task);

    return (
        <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 5}}>
                <Text style={{color: 'white'}}>{getCachingTaskLabel(task)}</Text>
            </View>
            <View style={{flex: 1, minWidth: 70}}>
                <MenuRadioButton
                    label={`${status || CacheTaskStatus.idle}`}
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
            </View>
            <View style={{flex: 1, minWidth: 60}}>
                <Text style={{color: 'white'}}>{`${(100 * (progress || 0)).toFixed(2)}%`}</Text>
            </View>
            <ActionButton
                svg={<DeleteSvg/>}
                touchable={true}
                style={{width: 32}}
                onPress={() => {
                    task.remove();
                }}/>
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
                    items={tasks.length === 0 ? <EmptyMediaCacheView/> : tasks.map((task, id) => <TaskItemView key={id} id={id} task={task}/>)}
                />
            }
        />
    );
};
