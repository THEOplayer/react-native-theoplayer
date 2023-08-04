## Media Cache

### Overview

The Media Cache API facilitates the download of media assets for offline playback.
This section provides an overview of how to utilize the Media Caching API,
create caching tasks, and control the media cache.

### Creating a CachingTask

To initiate the download process of a media asset, you need to create a `CachingTask`.
This task requires two essential parameters: a `SourceDescription` specifying the asset
to be cached, and `CachingTaskParameters` that define caching settings.

Below is an example of creating a caching task:

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

Once the `CachingTask` is created, it enters the idle state. To initiate the download process:
```typescript
task.start();
```

Additionally, you can pause or remove the task from the media cache using these methods:

```typescript
task.pause();
task.remove();
```

### Listening for Cache events

Both `MediaCache` and `CachingTask` instances dispatch events to notify about changes and status updates.

### Querying the MediaCache

### Using React hooks

For convenience, React hooks are available to simplify handling caching tasks without the need to subscribe or
unsubscribe to listeners.

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

