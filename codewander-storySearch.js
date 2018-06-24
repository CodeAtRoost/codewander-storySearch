define( ["qlik", "text!./template.html",'css!./css/scoped-bootstrap.css','css!./css/jquery-ui.css','./lib/js/jquery-ui'],
	function ( qlik, template,bootstrapcss, accss,ac ) {

		return {
			template: template,
			definition: {
				type: "items",
				component: "accordion",
				items: {
					
					settings:{
						uses: "settings",
						items:{
						
						enablescroll:{
						type: "boolean",
						component: "switch",
						label: "Enable Scroll",
						ref: "enableScroll",
						options: [{
							value: true,
							label: "Yes"
						}, {
							value: false,
							label: "No"
						}],
						defaultValue: true					
						},
						listheight:{
						ref:"listHeight",
						label: "List Height (px) when scroll is enabled",
						type: "string",
						defaultValue:"200"						
						},
						searchplaceholder:{
						ref:"placeHolder",
						label: "Search box placeholder",
						type: "string",
						defaultValue:"Search stories"						
						}
						}
						}
					
					}
				}
			,
			
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
			var self=this;
			this.$scope.stories=[];
			var self = this;
			var app=self.$scope.app;
			app.getList('story', function(reply){
			self.$scope.stories=[];
			$.each(reply.qAppObjectList.qItems, function(key, value) {
				self.$scope.stories.push({label: value.qMeta.title, value:value.qMeta.title, id:value.qInfo.qId});
					
			} );
			$( "#tags" ).autocomplete({
				  source: self.$scope.stories
					,
					select: function( event, ui ) {
						$( "#tags" ).val( ui.item.label );
						self.$scope.currentStory= ui.item.id;
						
						return false;
					  },
					  minLength:0,
					  open: function( event, ui ) {
						  
						  if (self.$scope.enableScroll){
							$('.ui-autocomplete').css("max-height", self.$scope.listHeight + "px");
							$('.ui-autocomplete').css("overflow-y", "auto");
							$('.ui-autocomplete').css("overflow-x", "hidden");
						  }
						  
					  }
					 
			})
			
			});
			
				
				return qlik.Promise.resolve();
			},
			controller: ['$scope','$window', function ( $scope, $window ) {
				$scope.app=qlik.currApp();
				$scope.listHeight= $scope.layout.listHeight;
				$scope.enableScroll= $scope.layout.enableScroll;
				$scope.placeHolder= $scope.layout.placeHolder;
				//add your rendering code here
				$scope.html = "Hello World";
				$scope.stories=[];
				$scope.currentStory="";
				$scope.$watch('currentStory', function(newVal, oldVal){
					if (newVal!= ""){
						$window.open("app/"+encodeURI($scope.app.id).replace(":","%3A") + "/story/"+ newVal+ "/state/play","_blank")
					
					}
				
				
				
				})
				
				
				
				
			}]
		};

	} );

