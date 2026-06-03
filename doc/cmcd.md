# Getting started with CMCD on React Native

Media player clients can transmit useful information to Content Delivery Networks (CDNs) with each object request.
This implementation is planned to fully support Common Media Client Data (CMCD) as defined in
[CTA-5004-B](https://cta-wave.github.io/Resources/common-media-client-data--cta-5004-b.html), published in April 2026.

CMCD supports two modes of transmission:

- **Request mode**: CMCD data is sent as HTTP headers or query parameters on manifest and media segment requests.
- **Event mode** (available since v11.4.0): CMCD events are POSTed to configured HTTP endpoints.

## Usage

To enable CMCD, developers can set the `cmcd` parameter inside a SourceDescription.

```tsx
const source = {
  sources: [ /* ... */ ],
  /* ... */
  cmcd: {
    transmissionMode: CmcdTransmissionMode.SDK_DEFAULT
    /* ... */
  }
} as SourceDescription;
player.source = source;
```

By specifying the `transmissionMode` as `SDK_DEFAULT`, we let each SDK decide which transmission mode to use:

- Web: HTTP query argument
- iOS: custom HTTP request header (only option)
- Android: HTTP query argument

On Web and Android, you can force a specific transmission mode by providing a different value, e.g.

```tsx
const source = {
  sources: [ /* ... */ ],
  /* ... */
  cmcd: {
    transmissionMode: CmcdTransmissionMode.HTTP_HEADER
    /* ... */
  }
} as SourceDescription;
player.source = source;
```

On Web, there are additional configuration options. For more details, visit the API references.

## Remarks

- Note that CMCD request mode is only supported on iOS 18.0+.
- Note that using a custom HTTP header from a web browser user-agent will trigger a preflight OPTIONS request before
  each unique media object request. This will lead to an increased request rate against the server. As a result, for
  CMCD transmissions from web browser user-agents that require CORS-preflighting per URL, the preferred mode of use is
  query arguments.
