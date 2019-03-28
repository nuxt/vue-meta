# Caveats

## Reactive variables in template functions

Both [title](/api/#titletemplate) as [meta](/api/#content-templates) support using template function.
Due to how Vue determines reactivity it is not possible to use reactive variables directly in template function

```js
{
  // this wont work
  metaInfo() {
    return {
      titleTemplate: chunk => (
        this.locale === 'nl-NL'
        ? `${chunk} - Welkom`
        : `${chunk} - Welcome`
      )
    }
  }
}
```

You need to assign the reactive variable to a local variable for this to work:

```js
{
  // this will work
  metaInfo() {
    const locale = this.locale
    return {
      titleTemplate: chunk => (
        locale === 'nl-NL'
        ? `${chunk} - Welkom`
        : `${chunk} - Welcome`
      )
    }
  }
}
```
