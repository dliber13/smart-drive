/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/vehicle-options/route";
exports.ids = ["app/api/vehicle-options/route"];
exports.modules = {

/***/ "(rsc)/./app/api/vehicle-options/route.ts":
/*!******************************************!*\
  !*** ./app/api/vehicle-options/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nconst dynamic = \"force-dynamic\";\nfunction stockSortValue(stockNumber) {\n    const text = String(stockNumber || \"\").trim().toUpperCase();\n    const numeric = Number(text.replace(/[^0-9]/g, \"\"));\n    return Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric;\n}\nasync function GET() {\n    try {\n        const vehicles = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].vehicle.findMany({\n            where: {\n                status: \"ACTIVE\"\n            },\n            select: {\n                id: true,\n                stockNumber: true,\n                year: true,\n                make: true,\n                model: true,\n                mileage: true,\n                vehicleClass: true,\n                askingPrice: true,\n                status: true\n            },\n            take: 500\n        });\n        const sortedVehicles = [\n            ...vehicles\n        ].sort((a, b)=>{\n            const stockA = stockSortValue(a.stockNumber);\n            const stockB = stockSortValue(b.stockNumber);\n            if (stockA !== stockB) return stockA - stockB;\n            return String(a.stockNumber).localeCompare(String(b.stockNumber));\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            vehicles: sortedVehicles,\n            count: sortedVehicles.length\n        });\n    } catch (error) {\n        console.error(\"VEHICLE OPTIONS ERROR:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            reason: error?.message || \"Failed to load vehicle options\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3ZlaGljbGUtb3B0aW9ucy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ1Q7QUFFM0IsTUFBTUUsVUFBVSxnQkFBZ0I7QUFFdkMsU0FBU0MsZUFBZUMsV0FBbUI7SUFDekMsTUFBTUMsT0FBT0MsT0FBT0YsZUFBZSxJQUFJRyxJQUFJLEdBQUdDLFdBQVc7SUFDekQsTUFBTUMsVUFBVUMsT0FBT0wsS0FBS00sT0FBTyxDQUFDLFdBQVc7SUFDL0MsT0FBT0QsT0FBT0UsS0FBSyxDQUFDSCxXQUFXQyxPQUFPRyxnQkFBZ0IsR0FBR0o7QUFDM0Q7QUFFTyxlQUFlSztJQUNwQixJQUFJO1FBQ0YsTUFBTUMsV0FBVyxNQUFNZCxtREFBTUEsQ0FBQ2UsT0FBTyxDQUFDQyxRQUFRLENBQUM7WUFDN0NDLE9BQU87Z0JBQ0xDLFFBQVE7WUFDVjtZQUNBQyxRQUFRO2dCQUNOQyxJQUFJO2dCQUNKakIsYUFBYTtnQkFDYmtCLE1BQU07Z0JBQ05DLE1BQU07Z0JBQ05DLE9BQU87Z0JBQ1BDLFNBQVM7Z0JBQ1RDLGNBQWM7Z0JBQ2RDLGFBQWE7Z0JBQ2JSLFFBQVE7WUFDVjtZQUNBUyxNQUFNO1FBQ1I7UUFFQSxNQUFNQyxpQkFBaUI7ZUFBSWQ7U0FBUyxDQUFDZSxJQUFJLENBQUMsQ0FBQ0MsR0FBR0M7WUFDNUMsTUFBTUMsU0FBUzlCLGVBQWU0QixFQUFFM0IsV0FBVztZQUMzQyxNQUFNOEIsU0FBUy9CLGVBQWU2QixFQUFFNUIsV0FBVztZQUUzQyxJQUFJNkIsV0FBV0MsUUFBUSxPQUFPRCxTQUFTQztZQUV2QyxPQUFPNUIsT0FBT3lCLEVBQUUzQixXQUFXLEVBQUUrQixhQUFhLENBQUM3QixPQUFPMEIsRUFBRTVCLFdBQVc7UUFDakU7UUFFQSxPQUFPSixxREFBWUEsQ0FBQ29DLElBQUksQ0FBQztZQUN2QkMsU0FBUztZQUNUdEIsVUFBVWM7WUFDVlMsT0FBT1QsZUFBZVUsTUFBTTtRQUM5QjtJQUNGLEVBQUUsT0FBT0MsT0FBWTtRQUNuQkMsUUFBUUQsS0FBSyxDQUFDLDBCQUEwQkE7UUFFeEMsT0FBT3hDLHFEQUFZQSxDQUFDb0MsSUFBSSxDQUN0QjtZQUNFQyxTQUFTO1lBQ1RLLFFBQVFGLE9BQU9HLFdBQVc7UUFDNUIsR0FDQTtZQUFFeEIsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi93b3Jrc3BhY2VzL3NtYXJ0LWRyaXZlL2FwcC9hcGkvdmVoaWNsZS1vcHRpb25zL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5cbmV4cG9ydCBjb25zdCBkeW5hbWljID0gXCJmb3JjZS1keW5hbWljXCI7XG5cbmZ1bmN0aW9uIHN0b2NrU29ydFZhbHVlKHN0b2NrTnVtYmVyOiBzdHJpbmcpIHtcbiAgY29uc3QgdGV4dCA9IFN0cmluZyhzdG9ja051bWJlciB8fCBcIlwiKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgbnVtZXJpYyA9IE51bWJlcih0ZXh0LnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKSk7XG4gIHJldHVybiBOdW1iZXIuaXNOYU4obnVtZXJpYykgPyBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiA6IG51bWVyaWM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdmVoaWNsZXMgPSBhd2FpdCBwcmlzbWEudmVoaWNsZS5maW5kTWFueSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBzdGF0dXM6IFwiQUNUSVZFXCIsXG4gICAgICB9LFxuICAgICAgc2VsZWN0OiB7XG4gICAgICAgIGlkOiB0cnVlLFxuICAgICAgICBzdG9ja051bWJlcjogdHJ1ZSxcbiAgICAgICAgeWVhcjogdHJ1ZSxcbiAgICAgICAgbWFrZTogdHJ1ZSxcbiAgICAgICAgbW9kZWw6IHRydWUsXG4gICAgICAgIG1pbGVhZ2U6IHRydWUsXG4gICAgICAgIHZlaGljbGVDbGFzczogdHJ1ZSxcbiAgICAgICAgYXNraW5nUHJpY2U6IHRydWUsXG4gICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB0YWtlOiA1MDAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3J0ZWRWZWhpY2xlcyA9IFsuLi52ZWhpY2xlc10uc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3Qgc3RvY2tBID0gc3RvY2tTb3J0VmFsdWUoYS5zdG9ja051bWJlcik7XG4gICAgICBjb25zdCBzdG9ja0IgPSBzdG9ja1NvcnRWYWx1ZShiLnN0b2NrTnVtYmVyKTtcblxuICAgICAgaWYgKHN0b2NrQSAhPT0gc3RvY2tCKSByZXR1cm4gc3RvY2tBIC0gc3RvY2tCO1xuXG4gICAgICByZXR1cm4gU3RyaW5nKGEuc3RvY2tOdW1iZXIpLmxvY2FsZUNvbXBhcmUoU3RyaW5nKGIuc3RvY2tOdW1iZXIpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgdmVoaWNsZXM6IHNvcnRlZFZlaGljbGVzLFxuICAgICAgY291bnQ6IHNvcnRlZFZlaGljbGVzLmxlbmd0aCxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJWRUhJQ0xFIE9QVElPTlMgRVJST1I6XCIsIGVycm9yKTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogZXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCB2ZWhpY2xlIG9wdGlvbnNcIixcbiAgICAgIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsImR5bmFtaWMiLCJzdG9ja1NvcnRWYWx1ZSIsInN0b2NrTnVtYmVyIiwidGV4dCIsIlN0cmluZyIsInRyaW0iLCJ0b1VwcGVyQ2FzZSIsIm51bWVyaWMiLCJOdW1iZXIiLCJyZXBsYWNlIiwiaXNOYU4iLCJNQVhfU0FGRV9JTlRFR0VSIiwiR0VUIiwidmVoaWNsZXMiLCJ2ZWhpY2xlIiwiZmluZE1hbnkiLCJ3aGVyZSIsInN0YXR1cyIsInNlbGVjdCIsImlkIiwieWVhciIsIm1ha2UiLCJtb2RlbCIsIm1pbGVhZ2UiLCJ2ZWhpY2xlQ2xhc3MiLCJhc2tpbmdQcmljZSIsInRha2UiLCJzb3J0ZWRWZWhpY2xlcyIsInNvcnQiLCJhIiwiYiIsInN0b2NrQSIsInN0b2NrQiIsImxvY2FsZUNvbXBhcmUiLCJqc29uIiwic3VjY2VzcyIsImNvdW50IiwibGVuZ3RoIiwiZXJyb3IiLCJjb25zb2xlIiwicmVhc29uIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/vehicle-options/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = global.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    global.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQU05QyxNQUFNQyxTQUFTQyxPQUFPRCxNQUFNLElBQUksSUFBSUQsd0RBQVlBO0FBRWhELElBQUlHLElBQXFDLEVBQUU7SUFDekNELE9BQU9ELE1BQU0sR0FBR0E7QUFDbEI7QUFFQSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsiL3dvcmtzcGFjZXMvc21hcnQtZHJpdmUvbGliL3ByaXNtYS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IHByaXNtYSA9IGdsb2JhbC5wcmlzbWEgfHwgbmV3IFByaXNtYUNsaWVudCgpO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIGdsb2JhbC5wcmlzbWEgPSBwcmlzbWE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnbG9iYWwiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvehicle-options%2Froute&page=%2Fapi%2Fvehicle-options%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvehicle-options%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvehicle-options%2Froute&page=%2Fapi%2Fvehicle-options%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvehicle-options%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _workspaces_smart_drive_app_api_vehicle_options_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/vehicle-options/route.ts */ \"(rsc)/./app/api/vehicle-options/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/vehicle-options/route\",\n        pathname: \"/api/vehicle-options\",\n        filename: \"route\",\n        bundlePath: \"app/api/vehicle-options/route\"\n    },\n    resolvedPagePath: \"/workspaces/smart-drive/app/api/vehicle-options/route.ts\",\n    nextConfigOutput,\n    userland: _workspaces_smart_drive_app_api_vehicle_options_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2ZWhpY2xlLW9wdGlvbnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnZlaGljbGUtb3B0aW9ucyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnZlaGljbGUtb3B0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj0lMkZ3b3Jrc3BhY2VzJTJGc21hcnQtZHJpdmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRndvcmtzcGFjZXMlMkZzbWFydC1kcml2ZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDUTtBQUNyRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL3dvcmtzcGFjZXMvc21hcnQtZHJpdmUvYXBwL2FwaS92ZWhpY2xlLW9wdGlvbnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3ZlaGljbGUtb3B0aW9ucy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3ZlaGljbGUtb3B0aW9uc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdmVoaWNsZS1vcHRpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL3dvcmtzcGFjZXMvc21hcnQtZHJpdmUvYXBwL2FwaS92ZWhpY2xlLW9wdGlvbnMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvehicle-options%2Froute&page=%2Fapi%2Fvehicle-options%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvehicle-options%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvehicle-options%2Froute&page=%2Fapi%2Fvehicle-options%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvehicle-options%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();