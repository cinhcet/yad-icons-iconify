# yad-icons-iconify
Icons as native web-components.

When installing this software via `npm install` (or by running `node convert.js default`), the icons from https://iconify.design/ (a project from Vjacheslav Trushkin) are converted to native web-components.

The converted icons can be found in the folder `components/COLLECTION` with the naming scheme
```
yad-icon-COLLECTION-NAME.js
```
where `COLLECTION` corresponds to the icon collection (e.g. `mdi` for material design icons) and `NAME` corresponds to the name of the icon.

To set the size of the icon, use the css custom property `--yad-icon-size`.

By default, only the collections `mdi`, `fa` and `wi` are installed. Use `node convert.js COLLECTION` to convert other collections (see https://iconify.design/ for all)

## Example
Import `yad-icons-iconify/components/mdi/yad-icon-mdi-lightbulb.js`
and then
```
<yad-icon-mdi-lightbulb style="--yad-icon-size: 40px; color: orange;"></yad-icon-mdi-lightbulb>
```
will give you an orange lightbulb, size 40px.

## Note
Do not redistribute the converted icons without taking the licences of the original icons, see https://github.com/iconify/collections-json/blob/master/collections.md, into account.

