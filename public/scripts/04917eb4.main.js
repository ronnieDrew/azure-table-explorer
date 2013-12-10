!function(){Ember.onerror=function(a){console.log("Ember.onerror",a)};var a=window.App=Ember.Application.create({LOG_TRANSITIONS:!0,LOG_ACTIVE_GENERATION:!0});Ember.LOG_BINDING=!0,Ember.ENV.RAISE_ON_DEPRECATION=!0,Ember.LOG_STACKTRACE_ON_DEPRECATION=!0,a.ajax=function(a,b){var c=this;return c.options=b||{},Ember.RSVP.Promise(function(b,d){c.options.success=function(a){Ember.run(null,b,a)},c.options.error=function(){Ember.run(null,d,arguments)},$.ajax(a,c.options)})}}(),function(){App.ApplicationRoute=Ember.Route.extend({events:{error:function(a){var b=this.router.container.lookup("controller:error");b.set("model",a),this.render("errorModal",{into:"application",outlet:"modalOutlet",controller:b})},openModal:function(a){var b=this.router.container.lookup("controller:"+a),c=a;this.render(c,{into:"application",outlet:"modalOutlet",controller:b})},closeModal:function(){this.render("emptyTemplate",{into:"application",outlet:"modalOutlet"})}}})}(),function(){App.AuthenticatedRoute=Ember.Route.extend({credentials:null,_redirectToLogin:function(a){var b=this.controllerFor("index");b.set("attemptedTransition",a),this.transitionTo("index")},beforeModel:function(a){var b=this.controllerFor("index").get("credentials");b?this.set("credentials",b):this._redirectToLogin(a)},events:{error:function(a,b){if(401!==a.status)throw{error:a,transition:b};this._redirectToLogin(b)}}})}(),function(){App.TableIndexRoute=App.AuthenticatedRoute.extend({model:function(a,b){return App.Table.create({id:b.params.table_id})}})}(),function(){App.TablePageRoute=App.AuthenticatedRoute.extend({renderTemplate:function(){var a=this.controllerFor("selectedRows");this.render(),this.render("table/selectedRows",{into:"tables",outlet:"selectedRowsOutlet",controller:a})},setupController:function(a,b){var c=this,d=b.id,e=this.modelFor("table").get("id"),f=this.get("credentials"),g=this._getPageContinuationToken(d-1);b.rows||(b=App.Page.find(e,f,d,g),b.then(function(b){c._setPageContinuationToken(b.id,b.continuation),a.set("model",b)},function(a){throw a}))},model:function(a){var b=parseInt(a.page_id,10)||1;return App.Page.create({id:b})},_getPageContinuationToken:function(a){var b=null,c=this.modelFor("table"),d=c.get("continuationTokens");return d&&(b=d[a]),b},_setPageContinuationToken:function(a,b){var c=this.modelFor("table"),d=c.get("continuationTokens");d||(d={},c.set("continuationTokens",d)),d[a]=b}})}(),function(){App.TableRoute=App.AuthenticatedRoute.extend({model:function(a,b){return App.Table.create({id:b.params.table_id})}})}(),function(){App.TablesIndexRoute=App.AuthenticatedRoute.extend({model:function(){return App.Tables.find(this.get("credentials"))}})}(),function(){App.TablesRoute=App.AuthenticatedRoute.extend({model:function(){return App.Tables.find(this.get("credentials"))}})}(),function(){App.IndexController=Ember.ObjectController.extend({storageAccount:"",storageKey:"",attemptedTransition:null,credentials:null,loginDisabled:function(){var a=this.getProperties("storageAccount","storageKey");return a.storageAccount.length>0&&a.storageKey.length>0?!1:!0}.property("storageAccount","storageKey"),usingSSL:function(){return"https:"===document.location.protocol}.property(),login:function(){var a=this,b=this.getProperties("storageAccount","storageKey"),c=this.get("attemptedTransition"),d=App.Tables.find(b);d.then(function(){a.set("credentials",b),c?(c.retry(),a.set("attemptedTransition",null)):a.transitionToRoute("tables.index")},function(b){a.set("credentials",null),a.send("error",b)})}})}(),function(){App.SelectedRowsController=Ember.ObjectController.extend({tablePage:null,needs:"tablePage",tablePageBinding:"controllers.tablePage",currentIndex:0,selectedRows:function(){var a=this.get("tablePage").get("rows"),b=_.where(a,{isSelected:!0});return b.length<=this.get("currentIndex")&&b.length>0&&this.set("currentIndex",b.length-1),b}.property("tablePage.rows.@each.isSelected"),hasSelectedRows:function(){return this.get("selectedRows").length>0}.property("selectedRows"),moveNext:function(){var a=this.get("currentIndex");a<this.get("selectedRows").length-1&&this.set("currentIndex",a+1)},movePrevious:function(){var a=this.get("currentIndex");a>0&&this.set("currentIndex",a-1)},moveNextEnabled:function(){return this.get("currentIndex")<this.get("selectedRows").length-1}.property("currentIndex","selectedRows"),movePreviousEnabled:function(){return this.get("currentIndex")>0}.property("currentIndex"),currentRow:function(){return this.get("selectedRows")[this.get("currentIndex")]}.property("selectedRows","currentIndex"),currentDisplayIndex:function(){return this.get("currentIndex")+1}.property("currentIndex")})}(),function(){App.TablePageController=Ember.ObjectController.extend({toggleRowSelection:function(a){var b=a.get("isSelected")||!1;a.set("isSelected",!b)},columns:function(){var a=[],b={id:!0,PartitionKey:!0,RowKey:!0,isSelected:!0,partitionKeyChanged:!0,_:!0};return _.each(this.get("rows"),function(c){for(var d in c){if(!c.hasOwnProperty(d))break;b[d]||_.contains(a,d)===!0||a.push(d)}}),a}.property("rows.@each"),columnHeaders:function(){var a=_.clone(this.get("columns"));return a.unshift(" "),a}.property("columns"),paginationLinks:function(){var a=[],b=this.get("id"),c=b>5?b-5:1,d=b;d+=this.get("continuation")?2:1,a.push(App.Page.create({id:b-1,displayText:"&larr;",disabled:1===b,isActive:!1})),c>1&&(a.push(App.Page.create({id:1,displayText:"1",disabled:!1,isActive:1===b})),c>2&&a.push(App.Page.create({id:2,displayText:"...",disabled:!0,isActive:!1})));for(var e=c;d>e;e++)a.push(App.Page.create({id:e,displayText:e,disabled:!1,isActive:e===b}));return a.push(App.Page.create({id:b+1,displayText:"&rarr;",disabled:this.get("continuation")?!1:!0,isActive:!1})),a}.property("id"),firstPartitionKey:function(){var a="",b=this.get("rows");return b&&b.length>0&&(a=b[0].PartitionKey),a}.property("rows.@each"),rowInfo:function(a){return a}})}(),function(){App.Page=Ember.Object.extend({id:null,continuation:null,rows:null}),App.Page.FIRSTPAGE=App.Page.create({id:1}),App.Page.reopenClass({find:function(a,b,c,d){var e,f={account:b.storageKey?b.storageAccount:void 0,key:b.storageKey,top:10};return d&&(f.nextPartitionKey=d.nextPartitionKey,f.nextRowKey=d.nextRowKey),Ember.RSVP.Promise(function(b,d){App.ajax("/json/table/"+a,{data:f}).then(function(a){b(App.Page.create({id:c,continuation:a.table.continuation,rows:_.map(a.table.rows,function(a){var b=App.Row.create(a);return b.set("id",a.PartitionKey+"."+a.RowKey),e&&b.get("PartitionKey")===e||(e=b.get("PartitionKey"),b.set("partitionKeyChanged",!0)),b})}))},function(a){d(a)})})}})}(),function(){App.Row=Ember.Object.extend({id:null,PartitionKey:null,RowKey:null,isSelected:!1,partitionKeyChanged:!1})}(),function(){App.Table=Ember.Object.extend({id:null,continuationTokens:null})}(),function(){App.Tables=Ember.Object.extend({id:null,storageAccountName:null,tables:null}),App.Tables.reopenClass({find:function(a){var b={account:a.storageKey?a.storageAccount:void 0,key:a.storageKey,top:10};return Ember.RSVP.Promise(function(a,c){App.ajax("/json/table",{data:b}).then(function(b){a(App.Tables.create({id:b.result.name,storageAccountName:b.result.name,tables:_.map(b.result.tables,function(a){return App.Table.create({id:a})})}))},function(a){c(a)})})}})}(),function(){App.BootstrapModalView=Ember.View.extend({layoutName:"modal_layout",backdrop:!0,keyboard:!0,backdropClass:"",positionSelector:null,position:"bottom",didInsertElement:function(){var a,b,c,d,e=this.get("controller");this.$(".modal").modal({dynamic:!0,keyboard:this.get("keyboard"),backdropClass:this.get("backdropClass")}),this.$(".modal").one("hidden",function(){e&&e.send("closeModal")}),this.get("positionSelector")&&(a=this._getPosition(this.get("positionSelector")),c=this.$(".modal").offsetWidth,d=this.$(".modal").offsetHeight,b={top:a.top+a.height,left:a.left+a.width/2-c/2},this._applyPlacement(b,this.get("position")))},_applyPlacement:function(a,b){var c,d=this.$(".modal"),e=d[0].offsetWidth,f=d[0].offsetHeight;d.offset(a).addClass(b),("bottom"===b||"top"===b)&&(c=0,a.left<0&&(c=-2*a.left,a.left=0,d.offset(a),e=d[0].offsetWidth,f=d[0].offsetHeight))},_getPosition:function(a){var b=$(a);return $.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},b.offset())},close:function(){this.$(".modal").modal("hide"),this.get("controller").send("closeModal")}})}(),function(){Ember.Checkbox=Ember.View.extend({classNames:["ember-checkbox"],tagName:"input",attributeBindings:["type","checked","indeterminate","disabled","tabindex","name"],type:"checkbox",checked:!1,disabled:!1,indeterminate:!1,bubbles:!0,init:function(){this._super(),this.on("change",this,this._updateElementValue)},didInsertElement:function(){this._super(),this.get("element").indeterminate=!!this.get("indeterminate"),this.get("bubbles")||this.$().click(function(a){a.stopPropagation()})},_updateElementValue:function(){Ember.set(this,"checked",this.$().prop("checked"))}})}(),function(){Ember.Handlebars.helper("tableCell",function(a,b){var c="",d=b.data.keywords.column;return a[d]&&(c=a[d]),moment(c).isValid()&&(c=moment(c).calendar()),c}),Ember.Handlebars.helper("safeString",function(a){return new Handlebars.SafeString(a)})}(),function(){App.Router.map(function(){this.resource("tables",function(){this.resource("table",{path:":table_id"},function(){this.route("page",{path:":page_id"})})})})}();