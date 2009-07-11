Ext.namespace("Ext.ux.layout.flexAccord");Ext.ux.layout.flexAccord.Layout=Ext.extend(Ext.layout.ContainerLayout,{defaultHeight:100,titleCollapse:true,hideCollapseTool:false,animate:false,monitorResize:true,_orgHeights:null,rendered:false,renderItem:function(D,A,C){if(this.animate===false){D.animCollapse=false}else{if(this.animate===true){D.animCollapse=true}}D.collapsible=true;D.autoWidth=true;if(this.titleCollapse){D.titleCollapse=true}if(this.hideCollapseTool){D.hideCollapseTool=true}var B=!D.rendered;Ext.ux.layout.flexAccord.Layout.superclass.renderItem.call(this,D,A,C);if(B&&D.dd){D.dd.b4StartDrag=D.dd.b4StartDrag.createInterceptor(function(){var E=this.panel;E._oldId=E.ownerCt.getId();if(!E.collapsed){E._wasExpanded=true;E._oldHeight=E.height;var F=E.ownerCt.getLayout();E.height=F.getHeaderHeight(this.panel);F.collapse(this.panel,true)}},D.dd);D.dd.endDrag=D.dd.endDrag.createSequence(function(){var E=this.panel;if(E._oldId==E.ownerCt.getId()){if(E._wasExpanded){E.height=E._oldHeight}E.ownerCt.doLayout();delete E._wasExpanded}delete E._oldHeight},D.dd)}if(!this._orgHeights){this._orgHeights={}}if(D.height===undefined||D.height=="auto"){D.height=this.defaultHeight}if(D.resizable===false&&!this._orgHeights[D.getId()]){this._orgHeights[D.getId()]=D.height}D.header.addClass("x-accordion-hd");D.un("beforeexpand",this.beforeExpand,this);D.un("collapse",this.onCollapse,this);D.on("beforeexpand",this.beforeExpand,this);D.on("collapse",this.onCollapse,this)},deleteSplitter:function(A){if(A.splitter){A.splitter.destroy(true);A.splitter=null;delete A.splitter;delete A.splitEl}},addSplitter:function(A){if(A.splitter){return }A.splitEl=A.el.createChild({cls:"ext-ux-flexaccord-splitter x-layout-split x-layout-split-south",html:"&#160;",id:A.getId()+"-xsplit"});A.splitter=new Ext.ux.layout.flexAccord.SplitBar(A.splitEl.dom,A,Ext.SplitBar.TOP)},unregisterPanel:function(A,C){A.un("collapse",this.onCollapse,this);A.un("beforeexpand",this.beforeExpand,this);this.deleteSplitter(A);if(this._orgHeights[A.getId()]){var B=C.getLayout();if(!B._orgHeights){B._orgHeights={}}B._orgHeights[A.getId()]=this._orgHeights[A.getId()];delete this._orgHeights[A.getId()]}},collapse:function(B,A){if(!B.rendered){return }if(A===true){B.un("collapse",this.onCollapse,this)}B.collapse(false);if(A===true){B.on("collapse",this.onCollapse,this)}},expand:function(C,B,A){if(A!==true){A=false}if(B!==false){C.un("beforeexpand",this.beforeExpand,this)}C.expand(A);if(B!==false){C.on("beforeexpand",this.beforeExpand,this)}},manageSplitbars:function(){var C=this.container.items.items;var A=C.length;if(A==0){return }this.deleteSplitter(C[A-1]);var B=true;for(var D=A-2;D>=0;D--){if(B&&C[D+1].hidden){this.deleteSplitter(C[D])}else{B=false;this.addSplitter(C[D])}}},onLayout:function(D,F){Ext.ux.layout.flexAccord.Layout.superclass.onLayout.call(this,D,F);var E=F.getStyleSize().width;var B=D.items.items;this.manageSplitbars();for(var C=0,A=B.length;C<A;C++){if(B[C].splitEl){B[C].splitEl.setWidth(B[C].getSize().width)}}if(!this.rendered){this.rendered=true;this.onResize();return }this.adjustHeight()},onResize:function(){Ext.ux.layout.flexAccord.Layout.superclass.onResize.call(this);if(!this.rendered){return }var I=this.container.items;var F=[];var B=[];var H=0;var A=this.container.getInnerHeight();var J=null;for(var E=0,G=I.length;E<G;E++){J=I.get(E);if(this.isResizable(J)){F.push(J)}else{B.push(J)}H+=J.height}var D=A-H;if(D<0){var K=function(M,L){return M.height-L.height};F.sort(K);B.sort(K);F.reverse();var C=D;if(F.length>0){C=Math.floor(C/F.length)}else{if(B.length>0){C=Math.floor(C/B.length)}}for(var E=0,G=F.length;E<G&&C!=0&&H>A;E++){C=this.addSpill(F[E],C);H-=C}for(var E=0,G=B.length;E<G&&C!=0&&H>A;E++){C=this.addSpill(B[E],C);H-=C}this.adjustHeight(B.concat(F))}else{this.adjustHeight()}},getHeaderHeight:function(A,B){return A.getSize().height+(B===true&&A.getBottomToolbar()?A.getBottomToolbar().getSize().height:0)+(B===true&&A.getTopToolbar()?A.getTopToolbar().getSize().height:0)-A.bwrap.getHeight()},adjustHeight:function(C,J){var B=this.container.el.getStyleSize().width;if(!Ext.isArray(C)){C=[]}var I=this.container.items;var A=this.container.getInnerHeight();var H=0;var E=null;for(var F=0,G=I.items.length;F<G;F++){var L=I.get(F);if(L.hidden){continue}if(L.height<=this.getHeaderHeight(L,true)+3){this.collapse(L,true);L.height=this.getHeaderHeight(L)}else{if(L.collapsed){if(J==L){this.expand(L,undefined,true)}else{this.expand(L)}L.height=Math.max(L.height,this.getHeaderHeight(L,true))}}if(!E&&this.isResizable(L)){if(C.indexOf(L)==-1){E=L}}L.setSize({height:L.height,width:B});H+=L.height}if(H<A&&E){E.height=E.getSize().height+(A-H);E.setHeight(E.height)}else{if(H>A&&E){var K=E.getSize().height-(H-A);var D=this.getHeaderHeight(E,true);E.height=Math.max(D,K);E.setHeight(E.height);if(K<=D){this.adjustHeight(C.concat([E]))}}}},isResizable:function(C,A,B){if(!C.rendered||(B!==true&&C.resizable===false)){return false}itemId=C.getId();itemHeight=C.height;if(itemHeight<=this.getHeaderHeight(C,true)&&A!==true){return false}return true},beforeExpand:function(G,F){var D=this._orgHeights[G.id]?this._orgHeights[G.id]:this.defaultHeight;var B=this.container.items;var E=null;var H=null;for(var C=0,A=B.length;C<A;C++){E=B.get(C);H+=B.get(C).getSize().height}if(H<this.container.getInnerHeight()){D=this.container.getInnerHeight()-(H-this.getHeaderHeight(G));if(this._orgHeights[G.id]&&D>this._orgHeights[G.id]){G.height=this._orgHeights[G.id];this.adjustHeight(B.items,(F!==false?G:undefined));return false}else{if(this._orgHeights[G.id]){D=this._orgHeights[G.id]}}}this.setItemHeight(G,D,(F!==false));return false},onCollapse:function(G,F){var B=this.container.items;var E=null;var H=0;var D=null;for(var C=0,A=B.length;C<A;C++){D=B.get(C);if(!E&&G!=D&&this.isResizable(D)){E=D}H+=D.getSize().height}if(E){E.height=E.height+(this.container.getInnerHeight()-H);E.setHeight(E.height)}G.height=this.getHeaderHeight(G)},setItemHeight:function(E,I,N){if(I<=0){return }var D=this.container;var L=D.items;var F=0;var O=L.indexOf(E);var A=D.getInnerHeight();F=I-E.height;var M=F>0?"down":"up";F=this.addSpill(E,F);var J=E.height;var H=L.items.length;var C=[];var B=[];var K=true;for(var G=O+1;G<H;G++){if(L.get(G).hidden){continue}if(!L.get(G).collapsed){K=false}if(L.get(G).resizable===false){B.push(L.get(G))}else{C.push(L.get(G))}}if(!K||E.resizable!==false||O!=0){if(L.get(O+1)&&L.get(O+1).resizable===false){B.reverse()}C=C.concat(B);for(var G=0,H=C.length;G<H&&F!=0;G++){F=this.addSpill(C[G],F)}}this.adjustHeight([],(N===true?E:null))},addSpill:function(B,F){if(B.resizable===false){if(F>0){tHeight=this._orgHeights[B.id]}else{tHeight=this.getHeaderHeight(B)}}else{tHeight=Math.max(this.getHeaderHeight(B),B.height+F)}var H=0;B.height=tHeight<=0?this.getHeaderHeight(B):tHeight;var G=0;var C=this.container.items;var E=null;for(var D=0,A=C.items.length;D<A;D++){E=C.get(D);if(E.hidden){continue}G+=E.height}return this.container.getInnerHeight()-G}});Ext.namespace("Ext.ux.layout.flexAccord");Ext.ux.layout.flexAccord.DropTarget=function(A,B){this.accordionPanel=A;Ext.dd.ScrollManager.register(A.body);Ext.ux.layout.flexAccord.DropTarget.superclass.constructor.call(this,A.bwrap.dom,B)};Ext.extend(Ext.ux.layout.flexAccord.DropTarget,Ext.dd.DropTarget,{_lastPos:-1,_findResizableElement:function(D,J){var I=D.items.items;var G=D.getLayout();var B=null;var F=null;var C=0;var A=D.getInnerHeight();var K=null;for(var E=0,H=I.length;E<H;E++){K=I[E];C+=K.getSize().height;if(!K.collapsed){if(!B&&G.isResizable(K)&&K.getSize().height>J){B=K}if(!F&&!G.isResizable(K)&&K.getSize().height>J){F=K}}}if(B){return{item:B,overallHeight:C,innerHeight:A}}return{item:F,overallHeight:C,innerHeight:A}},createEvent:function(A,C,B,D){return{accordionPanel:this.accordionPanel,panel:B.panel,position:D,data:B,source:A,rawEvent:C,status:this.dropAllowed}},notifyEnter:function(A,E,D){var B=Ext.ux.layout.flexAccord.DropTarget.superclass.notifyEnter.call(this,A,E,D);var C=A.getProxy().getProxy().dom.parentNode.id;if(D._lastResizeInfo&&C!=this.accordionPanel.body.dom.id){D._lastResizeInfo.panel.setHeight(D._lastResizeInfo.height);D._lastResizeInfo=null}return B},notifyOver:function(N,J,E){var P=J.getXY();var C=this.accordionPanel;var M=N.proxy;var A=null;var G=false;var L=0;var K=C.items;if(K){for(var I=K.length;L<I;L++){A=K.get(L);var F=A.el.getHeight();if(F!==0&&(A.el.getY()+(F/2))>P[1]){G=true;break}}}else{L=false}var D=this.createEvent(N,J,E,L);if(C.fireEvent("validatedrop",D)!==false&&C.fireEvent("beforedragover",D)!==false){var H=this.accordionPanel.getLayout();var B=M.getProxy();if(N.panel.ownerCt.getId()!=C.getId()){var O=this._findResizableElement(C,B.getSize().height);if(O.item&&O.innerHeight-O.overallHeight<B.getSize().height){C.doLayout();E._lastResizeInfo={height:O.item.getSize().height,panel:O.item};O.item.setHeight(O.item.getSize().height-B.getSize().height)}}B.setWidth("auto");if(G){if(M.proxy.dom.nextSibling!=A.el.dom){M.moveProxy(A.el.dom.parentNode,A.el.dom)}}else{Ext.fly(C.body).appendChild(B)}this._lastPos=L;C.fireEvent("dragover",D);return D.status}else{return D.status}},notifyDrop:function(J,G,E,I){if(this._lastPos==-1){return }var I=this._lastPos;var B=this.createEvent(J,G,E,I);if(this.accordionPanel.fireEvent("validatedrop",B)!==false&&this.accordionPanel.fireEvent("beforedrop",B)!==false){J.proxy.getProxy().remove();E._lastResizeInfo=null;var C=J.panel.ownerCt;var D=this.accordionPanel;var H=D.getLayout();var F=C.getLayout();var A=C.getId()==D.getId();if(!A){C.getLayout().unregisterPanel(J.panel,this.accordionPanel);C.remove(J.panel,false);C.doLayout();C.getLayout().adjustHeight()}J.panel.el.dom.parentNode.removeChild(J.panel.el.dom);if(I!==false){this.accordionPanel.insert(I,J.panel)}else{this.accordionPanel.add(J.panel)}if(!A){(function(){J.panel.ownerCt.doLayout();if(J.panel._wasExpanded===true){J.panel.expand(false);delete J.panel._wasExpanded}}).defer(1)}this.accordionPanel.fireEvent("drop",B)}this._lastPos=-1}});Ext.namespace("Ext.ux.layout.flexAccord");Ext.ux.layout.flexAccord.DropPanel=Ext.extend(Ext.Panel,{initComponent:function(){Ext.apply(this,{layout:new Ext.ux.layout.flexAccord.Layout(this.layoutConfig||{})});this.addEvents("validatedrop","beforedragover","dragover","beforedrop","drop");Ext.ux.layout.flexAccord.DropPanel.superclass.initComponent.call(this)},initEvents:function(){Ext.ux.layout.flexAccord.DropPanel.superclass.initEvents.call(this);this.dd=new Ext.ux.layout.flexAccord.DropTarget(this,this.dropConfig)},beforeDestroy:function(){if(this.dd){this.dd.unreg()}Ext.ux.layout.flexAccord.DropPanel.superclass.beforeDestroy.call(this)}});Ext.namespace("Ext.ux.layout.flexAccord");Ext.ux.layout.flexAccord.SplitBar=function(C,E,B,D,A){this.resizingComponent=E;Ext.ux.layout.flexAccord.SplitBar.superclass.constructor.call(this,C,E.el,B,D,A);this.adapter.setElementSize=function(H,G,I){var F=H.resizingComponent;F.ownerCt.getLayout().setItemHeight(F,G)}};Ext.extend(Ext.ux.layout.flexAccord.SplitBar,Ext.SplitBar,{getMinimumSize:function(){var E=this.resizingComponent;var A=E.ownerCt.items.items;var B=null;var D=E.ownerCt.getLayout();var C=A.indexOf(E);if(C==A.length-2&&A[A.length-1].resizable===false){if(!A[A.length-1].collapsed){return E.getSize().height}else{return E.getSize().height-(D._orgHeights[A[A.length-1].id]-D.getHeaderHeight(E))}}return this.resizingComponent.getSize().height-this.resizingComponent.bwrap.getHeight()},getMaximumSize:function(){var F=this.resizingComponent.ownerCt.items.items;var B=null;var H=this.resizingComponent;var A=H.ownerCt.getInnerHeight();var D=H.ownerCt.getLayout();var I=F.indexOf(H);if(H.resizable!==false&&I!=F.length-2){var G=0;for(var C=0,E=F.length;C<E;C++){if(C>I){G+=D.getHeaderHeight(F[C])}else{if(C!=I){G+=F[C].height}}}return(A-G)}if(H.resizable===false){return H.ownerCt.getLayout()._orgHeights[H.id]}for(var C=0,E=F.length;C<E;C++){if(F[C]==H&&F[C+1]){B=F[C+1];return H.getSize().height+B.getSize().height-(H.getSize().height-H.bwrap.getHeight())}}}});