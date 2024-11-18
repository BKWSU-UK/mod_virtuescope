<div id="virtuescopeContainer" class="row">
    <!-- UI Part -->
    <div id="canvasContainer" class="col-md-6 col-sm-6 col-xs-12 span6">
        <div id="rotation"></div>
        <canvas id="myCanvas"></canvas>
        <canvas id="triangle" width="90" height="50"></canvas>
        <div id="showAdvanced" title="Click for more options">+</div>
        <div id="advanced">
            <form>
                <span id="movement">Movement:</span>
                <select id="behaviour">
                    <option value="1">Deceleration</option>
                    <option value="2">Constant</option>
                    <option value="3">Crazy</option>
                </select>
                <!-- History -->
            </form>
            <a href="#" onclick="return hist.renderHistory()" id="showHist">Show history</a>
            <a href="#" onclick="return hist.deleteHistory()" id="delHist">Delete history</a>
            <a href="#" id="showImages" title="Cards with images will be displayed.">Show images</a>

            <div id="history"></div>
        </div>
        <div id="dialogueVs"></div>
    </div>
    <div id="yearPlanControls" class="col-md-6 col-sm-6 col-xs-12 span6">
        <div class="row">
            <div id="textDisplay">
                  <p id="introText" class="card-text"></p>
                  <div id="virtuescopeContent" class="card mb-4"></div>
                  <div id="runningMsg"></div>
            </div>
        </div>
        <div class="row g-4">
          <div class="col-md-12" id="spinButtonDiv">
            <button id="startIt" class="btn btn-primary btn-lg ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button">Play</button>
          </div>
            <div class="col-md-6 span6" id="plansFormDiv">
                <!-- Wheel controls -->
                <!--button id="startIt" class="btn btn-primary btn-lg">Play</button-->                
                  <form id="plansForm">
                    <select id="plans" class="form-select"></select>
                  </form>
                  <img id="spinner" src="/media/mod_virtuescope/images/icons/loading.gif" />
            </div>
            <div class="col-md-6 span6" id="yearPlanRestartRow">
                <button id="yearPlanRestart" onclick="yearPlan.restart(); jQuery('#plans').prop('selectedIndex',0).selectmenu('refresh');" class="btn btn-primary">Reset</button>
            </div>
        </div>
    </div>
</div>
<div class="row">
  <div class="col-md-6"><h2 id="virtuescopePredictions">Virtuescope Predictions</h2></div>
  <div class="col-md-6" id="sendButtons">
    <button id="yearPlanPdf" onclick="yearPlan.downloadPdf()" class="btn btn-primary">Download PDF</button>
    <button id="yearPlanMail" class="btn btn-primary">Send Email</button>
  </div>
  <div id="yearPlan" class="col-md-12"></div>
</div>