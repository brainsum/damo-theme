(this.webpackJsonpassets_wfa_widget=this.webpackJsonpassets_wfa_widget||[]).push([[0],{2:function(e,t,a){e.exports={header:"AssetsWaitingForApproval_header__3a1hI",header__buttons:"AssetsWaitingForApproval_header__buttons__3gTwN",header__title:"AssetsWaitingForApproval_header__title__1PeWt",header__placeholder:"AssetsWaitingForApproval_header__placeholder__2dwaX","filters__select-all":"AssetsWaitingForApproval_filters__select-all__eMz4O",header__button:"AssetsWaitingForApproval_header__button__3B8AP","header__button--approve":"AssetsWaitingForApproval_header__button--approve__2mby8","header__button--decline":"AssetsWaitingForApproval_header__button--decline__1BOoT",image__container:"AssetsWaitingForApproval_image__container__2w76t","image__hover-layer":"AssetsWaitingForApproval_image__hover-layer__2p_lL","details-button":"AssetsWaitingForApproval_details-button__IGQyV","checkmark-icon":"AssetsWaitingForApproval_checkmark-icon__3mY7d","image--selected":"AssetsWaitingForApproval_image--selected__1LrRC"}},29:function(e,t,a){},51:function(e,t,a){"use strict";a.r(t);var n=a(1),i=a.n(n),s=a(23),c=a.n(s),r=(a(29),a(12)),l=a.n(r),o=a(24),d=a(13),u=a(14),_=(a(31),a(10)),h=a.n(_),p=a(2),b=a.n(p),j=a.p+"static/media/checkmark_icon.756b7439.svg",v=a(0),f=function(e){var t=e.image,a=e.clickHandler;return Object(v.jsx)("div",{className:"views-row",children:Object(v.jsxs)("div",{className:"card card-inverse card--media ".concat(b.a.image__container),children:[Object(v.jsx)("img",{src:t.src,loading:"lazy",className:"card-img img-fluid ".concat(t.selected?b.a["image--selected"]:""),alt:t.alt}),Object(v.jsxs)("div",{className:b.a["image__hover-layer"],onClick:function(){return a(t)},children:[Object(v.jsx)("img",{src:j,alt:"checkmark icon",className:b.a["checkmark-icon"]}),Object(v.jsx)("button",{className:b.a["details-button"],onClick:function(e){e.preventDefault(),e.stopPropagation(),console.log("Details button clicked")},children:"details"})]})]})})},m=a(53),g=a(54),O=a(55),x=function(e){return e.filter((function(e){return e.selected}))},A=function(e){var t=e.images,a=e.approveHandler,n=e.selectAllHandler,i=e.filterHandler,s=e.showSelectedOnly;return Object(v.jsx)(m.a,{children:Object(v.jsx)(g.a,{children:Object(v.jsx)(O.a,{children:Object(v.jsxs)("div",{className:b.a.header,children:[Object(v.jsx)("div",{className:b.a.header__title,children:"Assets waiting for approval"}),0!==x(t).length?Object(v.jsxs)("div",{className:b.a.header__buttons,children:[Object(v.jsx)("button",{className:"".concat(b.a.header__button," ").concat(b.a["header__button--approve"]),onClick:function(){return a(!0)},children:"Approve selected items"}),Object(v.jsx)("button",{className:"".concat(b.a.header__button," ").concat(b.a["header__button--decline"]),onClick:function(){return a(!1)},children:"Decline"})]}):Object(v.jsx)("div",{className:b.a.header__placeholder,children:"Please select some assets."}),Object(v.jsxs)("div",{className:b.a.filters,children:[Object(v.jsx)("button",{className:b.a["filters__select-all"],onClick:n,children:t.every((function(e){return!0===e.selected}))?"Deselect all":"Select all"}),Object(v.jsxs)("button",{className:b.a["filters__select-all"],onClick:i,children:[!s&&Object(v.jsx)("span",{children:"Show selected only"}),s&&Object(v.jsx)("span",{children:"Show all"})]})]})]})})})})},w={username:"admin",password:"123456"},k=function(){var e=Object(n.useState)([]),t=Object(u.a)(e,2),a=t[0],i=t[1],s=Object(n.useState)(!1),c=Object(u.a)(s,2),r=c[0],_=c[1];Object(n.useEffect)((function(){h.a.get("/jsonapi/media/image?filter[status]=0&include=field_category,field_image,field_keywords,thumbnail",{auth:w}).then((function(e){var t,a=(null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.data)||[],n=[];a.forEach((function(e){var t,a,i,s;n.push({id:(null===e||void 0===e?void 0:e.id)||0,src:(null===e||void 0===e||null===(t=e.thumbnail)||void 0===t||null===(a=t.uri)||void 0===a?void 0:a.url)||"",alt:(null===e||void 0===e||null===(i=e.field_image)||void 0===i||null===(s=i.meta)||void 0===s?void 0:s.alt)||""})})),i(n)})).catch((function(e){console.log(e)}))}),[]);var p=function(e){e.selected=!e.selected,i(Object(d.a)(a))},b=function(){var e=Object(o.a)(l.a.mark((function e(t){var n,i,s,c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="/subrequests",i=a.filter((function(e){return e.selected})),s=[],e.next=5,h.a.get("/session/token?_format=json",{}).then((function(e){return e.data}));case 5:c=e.sent,t?i.forEach((function(e){s.push({requestId:""+e.id,uri:"/jsonapi/media/image/"+e.id,action:"update",body:'{"data":{"type":"media--image", "id":"'.concat(e.id,'","attributes":{"status":"1"}}}'),headers:{Accept:"application/json","Content-Type":"application/vnd.api+json","X-CSRF-Token":c}})})):i.forEach((function(e){s.push({requestId:""+e.id,uri:"/jsonapi/media/image/"+e.id,action:"delete",body:'{"data":{"type":"media--image", "id":"'.concat(e.id,'"}}'),headers:{Accept:"application/json","Content-Type":"application/vnd.api+json","X-CSRF-Token":c}})})),h.a.post(n,s,{auth:w}).then((function(e){window.location.reload()})).catch((function(e){console.log(e)}));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),j=a;r&&(j=a.filter((function(e){return e.selected})));var m=Object(v.jsx)("div",{className:"region region-content",children:Object(v.jsx)("div",{className:"views-element-container",children:Object(v.jsx)("div",{className:"assets-library unpublished-assets-library view-media-library view view-unpublished-assets view-id-unpublished_assets view-display-id-unpublished_assets js-view-dom-id-05c584ebdc7dfcb5a9045db210b02f4d99b6d8382701e8ba198069d9233ab838",children:Object(v.jsx)("div",{className:"view-content",children:j.map((function(e){return Object(v.jsx)(f,{image:e,clickHandler:p},e.id)}))})})})});return Object(v.jsxs)(v.Fragment,{children:[a.length>0&&Object(v.jsxs)("div",{children:[Object(v.jsx)(A,{images:a,approveHandler:b,selectAllHandler:function(){a.every((function(e){return!0===e.selected}))?a.forEach((function(e){e.selected=!1})):a.forEach((function(e){e.selected=!0})),i(Object(d.a)(a))},filterHandler:function(){_((function(e){return!e}))},showSelectedOnly:r}),m]}),0===a.length&&Object(v.jsx)("div",{children:"No results found."})]})};var y=function(){return Object(v.jsx)(k,{})},N=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,56)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,s=t.getLCP,c=t.getTTFB;a(e),n(e),i(e),s(e),c(e)}))};c.a.render(Object(v.jsx)(i.a.StrictMode,{children:Object(v.jsx)(y,{})}),document.getElementById("assets_wfa_widget_root")),N()}},[[51,1,2]]]);
//# sourceMappingURL=main.3e102422.chunk.js.map