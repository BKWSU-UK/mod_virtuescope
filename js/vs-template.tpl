<div class="container-fluid py-3">
    <div id="virtuescopeContainer" class="row g-4">
        <!-- UI Part -->
        <div id="canvasContainer" class="col-12 col-lg-6">
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
        <div id="yearPlanControls" class="col-12 col-lg-6">
            <div class="row">
                <div id="textDisplay" class="col-12">
                    <p id="introText" class="card-text"></p>
                    <div id="virtuescopeContent" class="card mb-4"></div>
                    <div id="runningMsg"></div>
                </div>
            </div>
<div class="container py-5">
    <div class="row g-4">
        <!-- Play Button Section -->
        <div class="col-12 d-flex justify-content-center">
            <button id="startIt" class="btn btn-primary btn-lg w-100">Play</button>
        </div>
        
        <!-- Plans Form and Spinner Section -->
        <div class="col-12 d-flex flex-column align-items-center">
            <form id="plansForm" class="w-100">
                <select id="plans" class="form-select mb-3">
                    <!-- Options go here -->
                </select>
            </form>
            <img id="spinner" class="img-fluid" src="/media/mod_virtuescope/images/icons/loading.gif" alt="Loading..." />
        </div>
        
        <!-- Reset Button Section -->
        <div class="col-12 d-flex justify-content-center">
            <button id="yearPlanRestart" 
                    onclick="yearPlan.restart(); jQuery('#plans').prop('selectedIndex', 0).selectmenu('refresh');" 
                    class="btn btn-outline-secondary btn-lg w-100">
                Reset
            </button>
        </div>
    </div>
</div>


        </div>
    </div>

    <div class="row align-items-center g-2 mt-3">
        <div class="col-12">
            <h2 id="virtuescopePredictions" class="h4 mb-0">Virtuescope Predictions</h2>
        </div>
        <!--div class="col-12 col-md-6" id="sendButtons">
            <div class="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                <button id="yearPlanPdf" onclick="yearPlan.downloadPdf()" class="btn btn-primary">Download PDF</button>
                <button id="yearPlanMail" class="btn btn-primary">Send Email</button>
            </div>
        </div-->
    </div>

    <div id="yearPlan" class="row mt-2"></div>
</div>
