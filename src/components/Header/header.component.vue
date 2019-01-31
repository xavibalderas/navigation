<template>
<div id="header">
    <font-awesome-icon icon="map-marker-alt"/></i><h1>{{ $t('header_find') }}<br/>{{ $t('header_spreiti') }}</h1>
</div>
</template>

<script>

export default {
  name: 'Header',
}
</script>

<style lang="scss" scoped>
@import "./header.styles.scss"
</style>
