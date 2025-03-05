# replaceCesiumDefaultValue

This tool allows to handle migration from `Cesium.defaultValue` to `??` javascript nullish coalescing operator (see Cesium Issue [#11674](https://github.com/CesiumGS/cesium/issues/11674) and PR [#12507](https://github.com/CesiumGS/cesium/pull/12507)).

It worked as is for the [Cesium](https://github.com/CesiumGS/cesium) project, but you might need to adapt it for your personal use case. Some known limitations are:

- comments inside `defaultValue` calls,
- more than 2 intricate calls to `defaultValue`,
- works only for ES6 `imports`, not for `require`,
- ...

Source code has no comment nor documentation (sorry about that :confused:) but if you have any question don't hesitate to ask...

To work properly, you will need prettier installed, either globally, or in your project. This is to get rid of extraneous parenthesis introduced by the migration tool.

## Usage

```shell
git clone https://github.com/jfayot/replaceCesiumDefaultValue.git
cd replaceCesiumDefaultValue
npm install
npm run build
node dist/index.js <path/to/your/project>
cd <path/to/your/project>
npm run prettier
```
