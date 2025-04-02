# Getting started with CMCD on React Native

Media player clients can transmit useful information to Content Delivery Networks (CDNs) with each object request.
This implementation supports Common Media Client Data (CMCD) as defined in
[CTA-5004](https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf), published in September 2020.

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

- Note that CMCD is only supported on iOS 18.0+.
- Note that CMCD is only supported with the [Media3 integration](./media3.md) on Android.
- Note that using a custom HTTP header from a web browser user-agent will trigger a preflight OPTIONS request before
  each unique media object request. This will lead to an increased request rate against the server. As a result, for
  CMCD transmissions from web browser user-agents that require CORS-preflighting per URL, the preferred mode of use is
  query arguments.
