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
exports.id = "app/api/controller-dashboard/route";
exports.ids = ["app/api/controller-dashboard/route"];
exports.modules = {

/***/ "(rsc)/./app/api/controller-dashboard/route.ts":
/*!***********************************************!*\
  !*** ./app/api/controller-dashboard/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_access__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/access */ \"(rsc)/./lib/access.ts\");\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_1__.PrismaClient();\nasync function GET(request) {\n    try {\n        const currentUserRole = (0,_lib_access__WEBPACK_IMPORTED_MODULE_2__.getCurrentUserRole)(request);\n        if (currentUserRole !== \"ADMIN\" && currentUserRole !== \"CONTROLLER\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                reason: \"Only ADMIN or CONTROLLER can access the controller dashboard\",\n                currentUserRole\n            }, {\n                status: 403\n            });\n        }\n        const applications = await prisma.application.findMany({\n            orderBy: {\n                createdAt: \"desc\"\n            },\n            take: 50\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            count: applications.length,\n            applications,\n            currentUserRole\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: error?.message || \"Failed to load controller dashboard\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NvbnRyb2xsZXItZGFzaGJvYXJkL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTBDO0FBQ0c7QUFDSTtBQUVqRCxNQUFNRyxTQUFTLElBQUlGLHdEQUFZQTtBQUV4QixlQUFlRyxJQUFJQyxPQUFnQjtJQUN4QyxJQUFJO1FBQ0YsTUFBTUMsa0JBQWtCSiwrREFBa0JBLENBQUNHO1FBRTNDLElBQUlDLG9CQUFvQixXQUFXQSxvQkFBb0IsY0FBYztZQUNuRSxPQUFPTixxREFBWUEsQ0FBQ08sSUFBSSxDQUN0QjtnQkFDRUMsU0FBUztnQkFDVEMsUUFBUTtnQkFDUkg7WUFDRixHQUNBO2dCQUFFSSxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNQyxlQUFlLE1BQU1SLE9BQU9TLFdBQVcsQ0FBQ0MsUUFBUSxDQUFDO1lBQ3JEQyxTQUFTO2dCQUNQQyxXQUFXO1lBQ2I7WUFDQUMsTUFBTTtRQUNSO1FBRUEsT0FBT2hCLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFDdkJDLFNBQVM7WUFDVFMsT0FBT04sYUFBYU8sTUFBTTtZQUMxQlA7WUFDQUw7UUFDRjtJQUNGLEVBQUUsT0FBT2EsT0FBWTtRQUNuQixPQUFPbkIscURBQVlBLENBQUNPLElBQUksQ0FDdEI7WUFDRUMsU0FBUztZQUNUWSxTQUFTRCxPQUFPQyxXQUFXO1FBQzdCLEdBQ0E7WUFBRVYsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi93b3Jrc3BhY2VzL3NtYXJ0LWRyaXZlL2FwcC9hcGkvY29udHJvbGxlci1kYXNoYm9hcmQvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiXG5pbXBvcnQgeyBnZXRDdXJyZW50VXNlclJvbGUgfSBmcm9tIFwiQC9saWIvYWNjZXNzXCJcblxuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IGN1cnJlbnRVc2VyUm9sZSA9IGdldEN1cnJlbnRVc2VyUm9sZShyZXF1ZXN0KVxuXG4gICAgaWYgKGN1cnJlbnRVc2VyUm9sZSAhPT0gXCJBRE1JTlwiICYmIGN1cnJlbnRVc2VyUm9sZSAhPT0gXCJDT05UUk9MTEVSXCIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIHJlYXNvbjogXCJPbmx5IEFETUlOIG9yIENPTlRST0xMRVIgY2FuIGFjY2VzcyB0aGUgY29udHJvbGxlciBkYXNoYm9hcmRcIixcbiAgICAgICAgICBjdXJyZW50VXNlclJvbGUsXG4gICAgICAgIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDMgfVxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IGFwcGxpY2F0aW9ucyA9IGF3YWl0IHByaXNtYS5hcHBsaWNhdGlvbi5maW5kTWFueSh7XG4gICAgICBvcmRlckJ5OiB7XG4gICAgICAgIGNyZWF0ZWRBdDogXCJkZXNjXCIsXG4gICAgICB9LFxuICAgICAgdGFrZTogNTAsXG4gICAgfSlcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgY291bnQ6IGFwcGxpY2F0aW9ucy5sZW5ndGgsXG4gICAgICBhcHBsaWNhdGlvbnMsXG4gICAgICBjdXJyZW50VXNlclJvbGUsXG4gICAgfSlcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgY29udHJvbGxlciBkYXNoYm9hcmRcIixcbiAgICAgIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJQcmlzbWFDbGllbnQiLCJnZXRDdXJyZW50VXNlclJvbGUiLCJwcmlzbWEiLCJHRVQiLCJyZXF1ZXN0IiwiY3VycmVudFVzZXJSb2xlIiwianNvbiIsInN1Y2Nlc3MiLCJyZWFzb24iLCJzdGF0dXMiLCJhcHBsaWNhdGlvbnMiLCJhcHBsaWNhdGlvbiIsImZpbmRNYW55Iiwib3JkZXJCeSIsImNyZWF0ZWRBdCIsInRha2UiLCJjb3VudCIsImxlbmd0aCIsImVycm9yIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/controller-dashboard/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/access.ts":
/*!***********************!*\
  !*** ./lib/access.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   canPullCredit: () => (/* binding */ canPullCredit),\n/* harmony export */   canSubmitDeal: () => (/* binding */ canSubmitDeal),\n/* harmony export */   getCurrentUserRole: () => (/* binding */ getCurrentUserRole),\n/* harmony export */   normalizeRole: () => (/* binding */ normalizeRole)\n/* harmony export */ });\nfunction normalizeRole(value) {\n    if (value === \"ADMIN\") return \"ADMIN\";\n    if (value === \"CONTROLLER\") return \"CONTROLLER\";\n    return \"SALES\";\n}\n/**\n * Local testing override:\n * always treat the current user as CONTROLLER.\n * Later we will swap this back to real auth/session logic.\n */ function getCurrentUserRole(_request) {\n    return \"CONTROLLER\";\n}\nfunction canPullCredit(role) {\n    return role === \"ADMIN\" || role === \"CONTROLLER\";\n}\nfunction canSubmitDeal(role) {\n    return role === \"ADMIN\" || role === \"CONTROLLER\" || role === \"SALES\";\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYWNjZXNzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFTyxTQUFTQSxjQUFjQyxLQUFnQztJQUM1RCxJQUFJQSxVQUFVLFNBQVMsT0FBTztJQUM5QixJQUFJQSxVQUFVLGNBQWMsT0FBTztJQUNuQyxPQUFPO0FBQ1Q7QUFFQTs7OztDQUlDLEdBQ00sU0FBU0MsbUJBQW1CQyxRQUFrQjtJQUNuRCxPQUFPO0FBQ1Q7QUFFTyxTQUFTQyxjQUFjQyxJQUFhO0lBQ3pDLE9BQU9BLFNBQVMsV0FBV0EsU0FBUztBQUN0QztBQUVPLFNBQVNDLGNBQWNELElBQWE7SUFDekMsT0FBT0EsU0FBUyxXQUFXQSxTQUFTLGdCQUFnQkEsU0FBUztBQUMvRCIsInNvdXJjZXMiOlsiL3dvcmtzcGFjZXMvc21hcnQtZHJpdmUvbGliL2FjY2Vzcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBBcHBSb2xlID0gXCJBRE1JTlwiIHwgXCJDT05UUk9MTEVSXCIgfCBcIlNBTEVTXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSb2xlKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogQXBwUm9sZSB7XG4gIGlmICh2YWx1ZSA9PT0gXCJBRE1JTlwiKSByZXR1cm4gXCJBRE1JTlwiO1xuICBpZiAodmFsdWUgPT09IFwiQ09OVFJPTExFUlwiKSByZXR1cm4gXCJDT05UUk9MTEVSXCI7XG4gIHJldHVybiBcIlNBTEVTXCI7XG59XG5cbi8qKlxuICogTG9jYWwgdGVzdGluZyBvdmVycmlkZTpcbiAqIGFsd2F5cyB0cmVhdCB0aGUgY3VycmVudCB1c2VyIGFzIENPTlRST0xMRVIuXG4gKiBMYXRlciB3ZSB3aWxsIHN3YXAgdGhpcyBiYWNrIHRvIHJlYWwgYXV0aC9zZXNzaW9uIGxvZ2ljLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXJSb2xlKF9yZXF1ZXN0PzogUmVxdWVzdCk6IEFwcFJvbGUge1xuICByZXR1cm4gXCJDT05UUk9MTEVSXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5QdWxsQ3JlZGl0KHJvbGU6IEFwcFJvbGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIHJvbGUgPT09IFwiQURNSU5cIiB8fCByb2xlID09PSBcIkNPTlRST0xMRVJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhblN1Ym1pdERlYWwocm9sZTogQXBwUm9sZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gcm9sZSA9PT0gXCJBRE1JTlwiIHx8IHJvbGUgPT09IFwiQ09OVFJPTExFUlwiIHx8IHJvbGUgPT09IFwiU0FMRVNcIjtcbn0iXSwibmFtZXMiOlsibm9ybWFsaXplUm9sZSIsInZhbHVlIiwiZ2V0Q3VycmVudFVzZXJSb2xlIiwiX3JlcXVlc3QiLCJjYW5QdWxsQ3JlZGl0Iiwicm9sZSIsImNhblN1Ym1pdERlYWwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/access.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontroller-dashboard%2Froute&page=%2Fapi%2Fcontroller-dashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontroller-dashboard%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontroller-dashboard%2Froute&page=%2Fapi%2Fcontroller-dashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontroller-dashboard%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _workspaces_smart_drive_app_api_controller_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/controller-dashboard/route.ts */ \"(rsc)/./app/api/controller-dashboard/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/controller-dashboard/route\",\n        pathname: \"/api/controller-dashboard\",\n        filename: \"route\",\n        bundlePath: \"app/api/controller-dashboard/route\"\n    },\n    resolvedPagePath: \"/workspaces/smart-drive/app/api/controller-dashboard/route.ts\",\n    nextConfigOutput,\n    userland: _workspaces_smart_drive_app_api_controller_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjb250cm9sbGVyLWRhc2hib2FyZCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY29udHJvbGxlci1kYXNoYm9hcmQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjb250cm9sbGVyLWRhc2hib2FyZCUyRnJvdXRlLnRzJmFwcERpcj0lMkZ3b3Jrc3BhY2VzJTJGc21hcnQtZHJpdmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRndvcmtzcGFjZXMlMkZzbWFydC1kcml2ZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDYTtBQUMxRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL3dvcmtzcGFjZXMvc21hcnQtZHJpdmUvYXBwL2FwaS9jb250cm9sbGVyLWRhc2hib2FyZC9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY29udHJvbGxlci1kYXNoYm9hcmQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9jb250cm9sbGVyLWRhc2hib2FyZFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvY29udHJvbGxlci1kYXNoYm9hcmQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvd29ya3NwYWNlcy9zbWFydC1kcml2ZS9hcHAvYXBpL2NvbnRyb2xsZXItZGFzaGJvYXJkL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontroller-dashboard%2Froute&page=%2Fapi%2Fcontroller-dashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontroller-dashboard%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontroller-dashboard%2Froute&page=%2Fapi%2Fcontroller-dashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontroller-dashboard%2Froute.ts&appDir=%2Fworkspaces%2Fsmart-drive%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2Fsmart-drive&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();