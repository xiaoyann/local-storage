# local-storage

A wrapper of localStorage in order to support expiration time and asynchronous execution.


## methods

##### clear() ```asynchronous```

```js
localStore.clear();
```

##### setItem(key, data, expires, onerror) ```asynchronous```

```js
// store data for an hour.
localStore.setItem('testKey', {name: 'yannxiao'}, 1000 * 60 * 60, function(err) {
    if (err.name === 'QuotaExceededError') {
        // todo sth when exceeded the quota.
    }
});

// same as native
localStore.setItem('testKey', {name: 'yannxiao'}, function(err) {
    if (err.name === 'QuotaExceededError') {
        // todo sth when exceeded the quota.
    }
});
```

##### getItem(key, callback) ```asynchronous```

```js
localStore.getItem('testKey', function(data) {
    // to do sth.
});
```

##### removeItem(key) ```asynchronous```

```js
localStore.removeItem('testKey1 testKey2');
```

##### key(nth) ```synchronous```

```js
var key = localStore.key(0);
```

##### getLength() ```synchronous```

```js
var len = localStore.getLength();
```