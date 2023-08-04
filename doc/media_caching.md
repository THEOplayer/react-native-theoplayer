## Media Cache

### Overview

The Media Caching API allows downloading media for offline playback.

### Creating a CachingTask



```typescript
// The source we want to cache.
const source = {
    source: [
        {
            src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
            type: "application/x-mpegurl"
        }
    ],
    metadata: {
        title: "Big Buck Bunny"
    }
} as SourceDescription;

// Caching parameters
const parameters = {
    // Cache the whole stream
    amount: '100%',

    // Cache for 24 hours
    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),

    // Cache quality
    bandwidth: 2000000,
} as CachingTaskParameters;

// Create a caching task
const task = await MediaCache.createTask(source, parameters);
```

### Control the CachingTask

Once a `CachingTask` is created, it is in `idle` state. To

### Querying the MediaCache

### Using React hooks

These React hooks are available for convenience. They remove the need for subscribing and unsubscribing to listeners.

#### useCachingTaskList

This hooks listens for updates in the `MediaCache.tasks` list, and returns the updated list.

```jsx
function TaskListView(props: {debug: boolean}) {
    const tasks = useCachingTaskList(props.debug);
    return <View style={styles.container}>
        {tasks.map((task, index) => <Text key={index} style={styles.taskListItem}>{task.id}</Text>)}
    </View>
}
```

#### useCachingTaskProgress and useCachingTaskStatus

These hooks listen for updates in both progress and status of a `CachingTask`.

```jsx
function CachingTaskView(props: {task: CachingTask, debug: boolean}) {
    const { task, debug } = props;
    const status = useCachingTaskStatus(task, debug);
    const progress = useCachingTaskProgress(task, debug);
    return <View>
        <Text>{`status: ${status}`}</Text>
        <Text>{`progress: ${progress}`}</Text>
    </View>
}
```

