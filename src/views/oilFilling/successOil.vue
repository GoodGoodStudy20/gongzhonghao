<template>
  <div class="box">
    <div class="qrcode-img">
      <div class="contennier" v-if="amount>0">
        恭喜您！<span>{{amount}}元 </span>加油券购买成功
      </div>
      <div class="contennier" v-if="chinaCodeData.isUsed==1">
        此券码已使用
      </div>
      <!-- <div ref="qrcode" id="qrcode" style="width:150px;height:150px;"> -->
      <div ref="qrcode" id="qrcode" style="width:150px;height:150px;" v-if="chinaCodeData.code">
        <!-- <vueQr :text="chinaCodeData.code" :size="150"></vueQr> -->
      </div>
      <div class="pay" v-if="amount>0">
        <img class="pay-img" src="../../assets/img/paysuccess.png" alt="">
        <div class="my-pay" @click="toMyCoupon">我的订单</div>
        <div class="click-my-pay">点击上方“我的订单”即可查看使用</div>
      </div>
      <div class="qr-code">券码每3分钟刷新一次</div>
      <!-- <div class="qr-code" v-if="chinaCodeData.code">券码每3分钟刷新一次</div> -->
      <div class="qr-code" v-if="chinaCodeData.isUsed==1">购买时间：{{chinaCodeData.createTime}}</div>
    </div>
    <!-- <div class="bottom-box" v-if="chinaCodeData.code && chinaCodeData.isUsed==1">
      <div class="common-title">温馨提示</div>
      <p v-for="(item,i) in codeList" :key="i">{{i+1}}. <span v-html="item"></span></p>
    </div> -->
    <div class="bottom-box">
      <!-- <div class="bottom-box" v-if="amount>0"> -->
      <div class="common-title">加油步骤</div>
      <p v-for="(item,i) in tipList" :key="i">{{i+1}}. <span v-html="item"></span></p>
    </div>
    <div class="use">
      <!-- <div class="use" v-if="amount>0"> -->
      <div class="common-title">加油流程</div>
      <div class="use-box">
        <svg width="304" height="85" viewBox="0 0 304 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="24.5" stroke="#9BC3FF" />
          <path d="M15.8882 23.6971C16.3788 23.1236 17.2449 23.0523 17.8227 23.5378L20.2355 25.5649L18.4589 27.6418L16.0462 25.6147C15.4684 25.1292 15.3976 24.2707 15.8882 23.6971Z" fill="url(#paint0_linear_937_4681)" />
          <path d="M39.5381 25.0083L41.8109 23.3439C42.4204 22.8975 43.2812 23.0261 43.7336 23.6311C44.1861 24.2361 44.0587 25.0883 43.4493 25.5346L41.1764 27.199L39.5381 25.0083Z" fill="url(#paint1_linear_937_4681)" />
          <path d="M37.7923 32.2194C37.7923 33.4255 36.8145 34.4032 35.6085 34.4032C34.4024 34.4032 33.4247 33.4255 33.4247 32.2194C33.4247 31.0134 34.4024 30.0356 35.6085 30.0356C36.8145 30.0356 37.7923 31.0134 37.7923 32.2194Z" fill="url(#paint2_linear_937_4681)" />
          <path d="M25.7962 32.2194C25.7962 33.4255 24.8185 34.4032 23.6124 34.4032C22.4063 34.4032 21.4286 33.4255 21.4286 32.2194C21.4286 31.0134 22.4063 30.0356 23.6124 30.0356C24.8185 30.0356 25.7962 31.0134 25.7962 32.2194Z" fill="url(#paint3_linear_937_4681)" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M24.025 19.8348C23.5526 19.8348 23.2326 20.1572 23.051 20.6521L21.1272 25.7499H38.765L36.8415 20.6521C36.6598 20.1572 36.3357 19.8348 35.8633 19.8348H24.025ZM19.2317 27.8928H19.2403H42.8572V36.6452H17.1428V27.8928H19.2317ZM20.6605 19.6304L18.4143 25.7499H17.4999C16.1192 25.7499 14.9999 26.9012 14.9999 28.3213V36.0356C14.9999 37.4558 16.1192 38.6071 17.4999 38.6071H18.215C18.2145 38.6219 18.2142 38.6368 18.2142 38.6517V40.8839C18.2142 41.5003 18.6939 41.9999 19.2856 41.9999H20.357C20.9488 41.9999 21.4285 41.5003 21.4285 40.8839V38.6517C21.4285 38.6368 21.4282 38.6219 21.4276 38.6071H38.5721C38.5716 38.6219 38.5713 38.6368 38.5713 38.6517V40.8839C38.5713 41.5003 39.051 41.9999 39.6427 41.9999H40.7141C41.3059 41.9999 41.7856 41.5003 41.7856 40.8839V38.6517C41.7856 38.6368 41.7853 38.6219 41.7847 38.6071H42.4999C43.8806 38.6071 44.9999 37.4558 44.9999 36.0356V28.3213C44.9999 26.9012 43.8806 25.7499 42.4999 25.7499H41.592L39.2316 19.6304C38.6866 18.1456 37.4085 17.1785 35.9914 17.1785H23.9007C22.4837 17.1785 21.2056 18.1456 20.6605 19.6304Z" fill="url(#paint4_linear_937_4681)" />
          <path d="M10.11 75.8C11.66 77.8 12.83 79.52 13.62 80.96L12.705 81.605C12.435 81.105 12.18 80.66 11.94 80.27C8.46 80.63 5.16 80.9 2.04 81.08L1.845 80.195C3.135 79.485 4.455 77.785 5.805 75.095H0.825V74.045H6.945V71.21H1.77V70.16H6.945V67.775H8.055V70.16H13.2V71.21H8.055V74.045H14.16V75.095H7.005C5.945 77.335 4.865 78.99 3.765 80.06C7.525 79.76 10.065 79.53 11.385 79.37C10.785 78.46 10.07 77.455 9.24 76.355L10.11 75.8ZM28.605 69.635V81.275H27.555V80.285H24.855V81.275H23.805V69.635H28.605ZM24.855 79.235H27.555V70.685H24.855V79.235ZM18.225 67.79H19.335V70.4H22.41C22.41 75.31 22.335 78.345 22.185 79.505C22.035 80.745 21.29 81.365 19.95 81.365L18.81 81.305L18.54 80.315C19.18 80.355 19.6 80.375 19.8 80.375C20.59 80.375 21.045 79.945 21.165 79.085C21.255 78.245 21.315 75.7 21.345 71.45H19.335V71.735C19.285 76.225 18.305 79.51 16.395 81.59L15.525 80.81C17.295 78.94 18.195 75.915 18.225 71.735V71.45H15.84V70.4H18.225V67.79ZM43.725 70.43V81.44H42.675V80.54H36.3V81.425H35.25V70.43H38.955V67.79H40.035V70.43H43.725ZM36.3 79.535H38.955V75.875H36.3V79.535ZM40.035 75.875V79.535H42.675V75.875H40.035ZM36.3 74.885H38.955V71.45H36.3V74.885ZM40.035 71.45V74.885H42.675V71.45H40.035ZM31.995 67.94C33.045 68.69 33.925 69.435 34.635 70.175L33.87 70.955C33.26 70.275 32.38 69.52 31.23 68.69L31.995 67.94ZM31.62 71.555C32.68 72.325 33.55 73.07 34.23 73.79L33.465 74.555C32.845 73.845 31.975 73.09 30.855 72.29L31.62 71.555ZM34.23 75.905C33.55 77.885 32.825 79.695 32.055 81.335L31.065 80.9C31.905 79.19 32.645 77.405 33.285 75.545L34.23 75.905ZM54.345 67.73H55.455V70.37H59.22V71.42H55.455V74.345H58.485V81.41H57.435V80.42H53.205V81.425H52.17V74.345H54.345V67.73ZM53.205 79.415H57.435V75.29H53.205V79.415ZM45.84 70.235H48.27C48.11 69.495 47.895 68.76 47.625 68.03L48.72 67.85C48.93 68.54 49.125 69.335 49.305 70.235H51.735V71.285H45.84V70.235ZM47.205 72.185C47.575 73.975 47.9 75.975 48.18 78.185L47.28 78.41C47.02 76.4 46.68 74.425 46.26 72.485L47.205 72.185ZM51.495 79.25C49.815 79.74 47.98 80.15 45.99 80.48L45.735 79.445C46.835 79.295 47.92 79.1 48.99 78.86C49.45 76.8 49.79 74.535 50.01 72.065L51.06 72.215C50.81 74.585 50.455 76.72 49.995 78.62C50.595 78.46 51.095 78.32 51.495 78.2V79.25Z" fill="#333333" />
          <path d="M109.354 42.8536C109.549 42.6583 109.549 42.3417 109.354 42.1464L106.172 38.9645C105.976 38.7692 105.66 38.7692 105.464 38.9645C105.269 39.1597 105.269 39.4763 105.464 39.6716L108.293 42.5L105.464 45.3284C105.269 45.5237 105.269 45.8403 105.464 46.0355C105.66 46.2308 105.976 46.2308 106.172 46.0355L109.354 42.8536ZM73 43H74.5V42H73V43ZM77.5 43H80.5V42H77.5V43ZM83.5 43H86.5V42H83.5V43ZM89.5 43H92.5V42H89.5V43ZM95.5 43H98.5V42H95.5V43ZM101.5 43H104.5V42H101.5V43ZM107.5 43H109V42H107.5V43ZM109.707 43.2071C110.098 42.8166 110.098 42.1834 109.707 41.7929L103.343 35.4289C102.953 35.0384 102.319 35.0384 101.929 35.4289C101.538 35.8195 101.538 36.4526 101.929 36.8431L107.586 42.5L101.929 48.1569C101.538 48.5474 101.538 49.1805 101.929 49.5711C102.319 49.9616 102.953 49.9616 103.343 49.5711L109.707 43.2071ZM73 43.5H74.5V41.5H73V43.5ZM77.5 43.5H80.5V41.5H77.5V43.5ZM83.5 43.5H86.5V41.5H83.5V43.5ZM89.5 43.5H92.5V41.5H89.5V43.5ZM95.5 43.5H98.5V41.5H95.5V43.5ZM101.5 43.5H104.5V41.5H101.5V43.5ZM107.5 43.5H109V41.5H107.5V43.5Z" fill="url(#paint5_linear_937_4681)" />
          <circle cx="152" cy="30" r="24.5" stroke="#9BC3FF" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M153.139 31.0227H141.678V28.7454H153.139V31.0227Z" fill="url(#paint6_linear_937_4681)" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M140.76 20.0091C140.76 19.4518 141.212 19 141.769 19H153.047C153.605 19 154.056 19.4518 154.056 20.0091V30.4613L158.051 30.4613C158.67 30.4613 159.15 30.965 159.15 31.562V32.639L159.15 32.6522V37.7462C159.15 38.6462 159.88 39.3757 160.78 39.3757C161.68 39.3757 162.41 38.6462 162.41 37.7462V28.8317H159.15C158.644 28.8317 158.233 28.421 158.233 27.9143V22.4882L156.311 20.5661L157.608 19.2687L163.976 25.6361L163.976 25.6361C164.142 25.8022 164.244 26.0315 164.244 26.2848V37.7462C164.244 39.6595 162.693 41.2105 160.78 41.2105C158.867 41.2105 157.316 39.6595 157.316 37.7462V33.9257H157.316V32.2961L154.056 32.2961V39H155.686V41.2105H139.131V39H140.76V20.0091ZM143 39H151.758V21.2315H143V39Z" fill="url(#paint7_linear_937_4681)" />
          <path d="M123.68 68.645H135.365V69.695H132.86V73.67H136.145V74.705H132.86V81.35H131.765V74.705H127.43C127.29 76.255 127 77.535 126.56 78.545C125.99 79.805 125.045 80.78 123.725 81.47L123.14 80.54C124.36 79.85 125.21 78.935 125.69 77.795C126 76.945 126.215 75.915 126.335 74.705H122.87V73.67H126.395L126.41 73.145V69.695H123.68V68.645ZM127.52 69.695V73.415L127.505 73.67H131.765V69.695H127.52ZM140.525 67.775C140.395 68.795 140.26 69.74 140.12 70.61H142.34V71.24C142.22 73.66 141.8 75.755 141.08 77.525C141.83 78.305 142.41 78.97 142.82 79.52L142.1 80.36C141.64 79.75 141.14 79.155 140.6 78.575C139.99 79.735 139.245 80.725 138.365 81.545L137.69 80.69C138.58 79.88 139.305 78.91 139.865 77.78C139.335 77.24 138.69 76.605 137.93 75.875C138.29 74.565 138.605 73.155 138.875 71.645H137.675V70.61H139.055C139.205 69.66 139.34 68.685 139.46 67.685L140.525 67.775ZM140.315 76.745C140.875 75.255 141.21 73.555 141.32 71.645H139.955C139.665 73.265 139.375 74.57 139.085 75.56C139.525 75.96 139.935 76.355 140.315 76.745ZM150.26 75.125V81.515H149.225V80.615H144.635V81.515H143.6V75.125H150.26ZM144.635 79.595H149.225V76.115H144.635V79.595ZM142.85 72.8C143.73 72.35 144.81 70.66 146.09 67.73L147.11 68.075C146.22 69.995 145.32 71.55 144.41 72.74C146.12 72.62 147.725 72.44 149.225 72.2C148.775 71.31 148.35 70.55 147.95 69.92L148.88 69.47C149.73 70.83 150.505 72.275 151.205 73.805L150.2 74.285C149.9 73.595 149.725 73.205 149.675 73.115C147.615 73.405 145.395 73.625 143.015 73.775L142.85 72.8ZM165.605 69.635V81.275H164.555V80.285H161.855V81.275H160.805V69.635H165.605ZM161.855 79.235H164.555V70.685H161.855V79.235ZM155.225 67.79H156.335V70.4H159.41C159.41 75.31 159.335 78.345 159.185 79.505C159.035 80.745 158.29 81.365 156.95 81.365L155.81 81.305L155.54 80.315C156.18 80.355 156.6 80.375 156.8 80.375C157.59 80.375 158.045 79.945 158.165 79.085C158.255 78.245 158.315 75.7 158.345 71.45H156.335V71.735C156.285 76.225 155.305 79.51 153.395 81.59L152.525 80.81C154.295 78.94 155.195 75.915 155.225 71.735V71.45H152.84V70.4H155.225V67.79ZM180.725 70.43V81.44H179.675V80.54H173.3V81.425H172.25V70.43H175.955V67.79H177.035V70.43H180.725ZM173.3 79.535H175.955V75.875H173.3V79.535ZM177.035 75.875V79.535H179.675V75.875H177.035ZM173.3 74.885H175.955V71.45H173.3V74.885ZM177.035 71.45V74.885H179.675V71.45H177.035ZM168.995 67.94C170.045 68.69 170.925 69.435 171.635 70.175L170.87 70.955C170.26 70.275 169.38 69.52 168.23 68.69L168.995 67.94ZM168.62 71.555C169.68 72.325 170.55 73.07 171.23 73.79L170.465 74.555C169.845 73.845 168.975 73.09 167.855 72.29L168.62 71.555ZM171.23 75.905C170.55 77.885 169.825 79.695 169.055 81.335L168.065 80.9C168.905 79.19 169.645 77.405 170.285 75.545L171.23 75.905Z" fill="#333333" />
          <path d="M231.354 42.8536C231.549 42.6583 231.549 42.3417 231.354 42.1464L228.172 38.9645C227.976 38.7692 227.66 38.7692 227.464 38.9645C227.269 39.1597 227.269 39.4763 227.464 39.6716L230.293 42.5L227.464 45.3284C227.269 45.5237 227.269 45.8403 227.464 46.0355C227.66 46.2308 227.976 46.2308 228.172 46.0355L231.354 42.8536ZM195 43H196.5V42H195V43ZM199.5 43H202.5V42H199.5V43ZM205.5 43H208.5V42H205.5V43ZM211.5 43H214.5V42H211.5V43ZM217.5 43H220.5V42H217.5V43ZM223.5 43H226.5V42H223.5V43ZM229.5 43H231V42H229.5V43ZM231.707 43.2071C232.098 42.8166 232.098 42.1834 231.707 41.7929L225.343 35.4289C224.953 35.0384 224.319 35.0384 223.929 35.4289C223.538 35.8195 223.538 36.4526 223.929 36.8431L229.586 42.5L223.929 48.1569C223.538 48.5474 223.538 49.1805 223.929 49.5711C224.319 49.9616 224.953 49.9616 225.343 49.5711L231.707 43.2071ZM195 43.5H196.5V41.5H195V43.5ZM199.5 43.5H202.5V41.5H199.5V43.5ZM205.5 43.5H208.5V41.5H205.5V43.5ZM211.5 43.5H214.5V41.5H211.5V43.5ZM217.5 43.5H220.5V41.5H217.5V43.5ZM223.5 43.5H226.5V41.5H223.5V43.5ZM229.5 43.5H231V41.5H229.5V43.5Z" fill="url(#paint8_linear_937_4681)" />
          <circle cx="274" cy="30" r="24.5" stroke="#9BC3FF" />
          <path d="M278 35V34H275V31H278V33H280V35H279V37H277V39H275V36H277V35H278ZM283 39H279V37H281V35H283V39ZM265 21H273V29H265V21ZM267 23V27H271V23H267ZM275 21H283V29H275V21ZM277 23V27H281V23H277ZM265 31H273V39H265V31ZM267 33V37H271V33H267ZM280 31H283V33H280V31ZM268 24H270V26H268V24ZM268 34H270V36H268V34ZM278 24H280V26H278V24Z" fill="url(#paint9_linear_937_4681)" />
          <path d="M279 19H285V24" stroke="url(#paint10_linear_937_4681)" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M269 19H263V24" stroke="url(#paint11_linear_937_4681)" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M279 41H285V36" stroke="url(#paint12_linear_937_4681)" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M269 41H263V36" stroke="url(#paint13_linear_937_4681)" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M255.565 72.965V68.87H256.645V74.015H252.055V79.52H256.285V75.425H257.38V81.395H256.285V80.555H246.715V81.395H245.62V75.425H246.715V79.52H250.945V74.015H246.355V68.87H247.435V72.965H250.945V67.73H252.055V72.965H255.565ZM263.77 81.32L263.545 80.27C264.385 80.31 264.98 80.33 265.33 80.33C265.78 80.33 266.005 80.115 266.005 79.685V73.445H260.11V72.38H272.89V73.445H267.1V79.955C267.1 80.865 266.635 81.32 265.705 81.32H263.77ZM263.485 75.32C262.845 77.41 261.965 79.195 260.845 80.675L259.9 80.09C261.06 78.59 261.9 76.925 262.42 75.095L263.485 75.32ZM270.34 74.945C271.4 76.625 272.29 78.345 273.01 80.105L272.02 80.555C271.22 78.575 270.335 76.815 269.365 75.275L270.34 74.945ZM261.49 68.57H271.555V69.62H261.49V68.57ZM277.645 76.76V75.95C276.875 76.54 276.055 77.045 275.185 77.465L274.585 76.55C276.185 75.86 277.5 74.93 278.53 73.76H275.05V72.77H279.295C279.635 72.26 279.935 71.71 280.195 71.12H275.875V70.16H280.585C280.835 69.41 281.04 68.555 281.2 67.595L282.265 67.73C282.115 68.6 281.92 69.41 281.68 70.16H284.725L283.96 69.725C284.43 69.135 284.825 68.44 285.145 67.64L286.045 67.97C285.705 68.8 285.28 69.53 284.77 70.16H287.125V71.12H281.32C281.1 71.67 280.825 72.22 280.495 72.77H287.95V73.76H284.665C285.445 74.8 286.695 75.72 288.415 76.52L287.725 77.405C286.905 76.945 286.16 76.44 285.49 75.89C285.44 77.22 285.365 78.295 285.265 79.115C285.145 79.945 284.94 80.53 284.65 80.87C284.36 81.19 283.91 81.365 283.3 81.395H281.065L280.78 80.39C281.49 80.42 282.155 80.435 282.775 80.435C283.405 80.435 283.825 80.21 284.035 79.76C284.245 79.28 284.38 78.28 284.44 76.76H280.765C280.465 77.88 280.05 78.78 279.52 79.46C278.86 80.22 277.895 80.905 276.625 81.515L275.95 80.66C277.11 80.15 277.995 79.585 278.605 78.965C279.095 78.415 279.48 77.68 279.76 76.76H277.645ZM279.82 73.76C279.24 74.52 278.595 75.19 277.885 75.77H285.355C284.585 75.12 283.99 74.45 283.57 73.76H279.82ZM278.02 67.73C278.48 68.42 278.845 69.09 279.115 69.74L278.245 70.145C277.865 69.305 277.48 68.6 277.09 68.03L278.02 67.73ZM294.67 73.01V80.72H293.68V79.865H292.06V81.005H291.055V74.9C290.755 75.44 290.425 75.965 290.065 76.475L289.525 75.605C290.665 73.865 291.415 71.875 291.775 69.635H289.945V68.585H295.06V69.635H292.795C292.575 70.885 292.28 72.01 291.91 73.01H294.67ZM292.06 78.89H293.68V74H292.06V78.89ZM296.695 70.445L297.76 70.52L297.1 74.3H300.28L301.03 69.395H295.75V68.375H302.2L301.375 74.3H302.965C302.965 77.91 302.765 80.005 302.365 80.585C301.935 81.135 301.07 81.41 299.77 81.41C299.35 81.41 298.9 81.395 298.42 81.365L298.12 80.315C298.78 80.375 299.245 80.405 299.515 80.405C300.665 80.405 301.355 80.16 301.585 79.67C301.825 79.16 301.945 77.705 301.945 75.305H295.885L296.695 70.445ZM295.42 77.21H300.91V78.23H295.42V77.21Z" fill="#333333" />
          <defs>
            <linearGradient id="paint0_linear_937_4681" x1="17.1621" y1="23.2504" x2="16.1316" y2="26.5228" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint1_linear_937_4681" x1="40.1674" y1="24.8017" x2="43.1421" y2="26.4803" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint2_linear_937_4681" x1="34.0798" y1="30.3632" x2="36.8642" y2="34.4032" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint3_linear_937_4681" x1="22.0837" y1="30.3632" x2="24.8681" y2="34.4032" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint4_linear_937_4681" x1="19.4999" y1="19.0401" x2="34.0724" y2="44.5959" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint5_linear_937_4681" x1="78.4" y1="42.575" x2="78.4261" y2="43.9389" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint6_linear_937_4681" x1="143.397" y1="28.9162" x2="143.815" y2="31.9661" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint7_linear_937_4681" x1="142.898" y1="20.6658" x2="156.365" y2="42.7604" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint8_linear_937_4681" x1="200.4" y1="42.575" x2="200.426" y2="43.9389" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint9_linear_937_4681" x1="267.7" y1="22.35" x2="279.175" y2="39" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint10_linear_937_4681" x1="279.9" y1="19.375" x2="282.846" y2="24.5048" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint11_linear_937_4681" x1="268.1" y1="19.375" x2="265.154" y2="24.5048" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint12_linear_937_4681" x1="279.9" y1="40.625" x2="282.846" y2="35.4952" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
            <linearGradient id="paint13_linear_937_4681" x1="268.1" y1="40.625" x2="265.154" y2="35.4952" gradientUnits="userSpaceOnUse">
              <stop stop-color="#C0C4FF" />
              <stop offset="1" stop-color="#818CFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- <div class="use-box">
        <div class="img-box">
          <img src="@/assets/img/oil1.png">
          <div>前往加油站</div>
        </div>
        <div style="width:50px;height:0px;border-top:3px dashed #ccc;"></div>
        <div class="img-box">
          <img src="@/assets/img/oil2.png">
          <div>开始加油</div>
        </div>
        <div style="width:50px;height:0px;border-top:3px dashed #ccc;"></div>
        <div class="img-box" v-if="city == 'gd'">
          <img src="@/assets/img/oil3.png">
          <div>出示二维码</div>
        </div>
        <div class="img-box" v-if="city == 'hn'">
          <img src="@/assets/img/oil4.png">
          <div>出示电子券</div>
        </div>
      </div> -->
    </div>
    <Tabbars :active="0"></Tabbars>
  </div>
</template>



<script>
import { getJsJDK, gdPetroChinaCode } from '@/api/user'
import vueQr from 'vue-qr'
import wx from 'weixin-js-sdk'
import Tabbars from '@/components/tabbars.vue'
import { Dialog, Toast } from 'vant'
import { countVouchersInterests, addGdOilCouponRecharge, addGHnOilCouponRecharge } from '@/api/user'
import { Debounce, storageSet, storageGet } from '@/utils/utils'

export default {
  name: 'successOil',
  components: { Tabbars, vueQr },
  data() {
    return {
      bg: [
        require('@/assets/img/wlyn/qrcodedjljy.png'),
        require('@/assets/img/wlyn/hn.png'),
      ],
      ghId: {
        gd: 'gh_85d236dfcbaa',
        hn: 'gh_641fc8ab19f9'
      },
      city: '',
      amount: 0,
      pwNo: '',
      chinaCodeData: {},

    }
  },
  created() {
    if (this.$route.query.amount) {
      this.amount = this.$route.query.amount || 0
    }
    getJsJDK()
    if (this.$route.query.pwNo) {
      this.pwNo = this.$route.query.pwNo || 0
      this.gdPetroChinaCode()
    }
  },
  mounted() {
    let msg = this.$route.query.msg || ''
    if (msg && msg != 'true') {
      let dom = `<span style='color:red'>${msg}</span>`
      Dialog.confirm({
        title: '充值成功并赠送您',
        message: dom,
        confirmButtonColor: '#F14F44',
        cancelButtonText: '关闭',
        confirmButtonText: '去查看'
      }).then(() => {
        this.$router.replace('/user/my-coupons/index')
      }).catch(() => {

      });
    }
    let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''
    this.city = code == '410000' ? 'hn' : code == '440000' ? 'gd' : ''
  },
  computed: {
    codeList() {
      let list = [
        '仅限广东省中石油加油站使用;',
        '无需办理加油卡IC卡、无需圈存;',
        '该券可分次消费、一经充值不可退单、充值秒到账;',
        '自充值到账之日 180 天内有效,过期作废;',
        "如有疑问，请咨询 <a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"],
        list2 = [
          '前往就近中石化直营加油站;',
          '无需办理加油卡IC卡、无需圈存;',
          '该券可分次消费、一经充值不可退单、充值秒到账;',
          '自充值到账之日 180 天内有效,过期作废;',
          "如有疑问，请咨询 <a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"]
      return this.city == 'hn' ? list2 : list
    },
    tipList() {
      // list'前往广东省内中石化直营加油站；',
      //   '选择油品给爱车加油；',
      //   '向工作人员出示电子加油券二维码；',
      //   "如有疑问，请咨询 <a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"
      let list = [
        '请前往最近中石油加油站使用；',
        '选择油品给爱车加油；',
        '向工作人员出示电子加油券二维码；',
        "如有疑问，请咨询 <a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"],
        list2 = [
          '前往就近中石化直营加油站；',
          '选择油品给爱车加油；',
          '向工作人员出示电子加油券二维码；',
          "如有疑问，请咨询 <a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"]
      return this.city == 'hn' ? list2 : list

    },
    topTip() {
      return this.city == 'hn' ? "长按至河南中石化小程序 “中石化一键加油”" : "长按至广东中石化小程序 “大家来加油”"
    }
  },
  methods: {
    gdPetroChinaCode() {
      let param = {
        outOrderId: this.pwNo
      }
      console.log('outOrderId', param);
      gdPetroChinaCode(param).then(res => {
        console.log(res);
        if (res.code == '200') {
          this.chinaCodeData = res.data || {}
          console.log('chi', this.chinaCodeData);

        }
      })
    },
    toMyCoupon() {
      this.$router.push('/user/my-coupons/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 10px 0 70px;
  background: #fdfeff;
}
.fen {
  display: inline-block;
  width: 40px;
  border: 2px dashed #000;
}
.common {
  padding: 14px 10px;
  margin: 0px auto 8px;
  width: 351px;
  background: #ffffff;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.bottom-box {
  @extend .common;
  padding: 14px 10px;
  .common-title {
    margin-bottom: 14px;
  }
  h5 {
    margin: 0 0 12px;
    font-weight: normal;
    font-size: 12px;
    color: #333333;
  }
  p {
    margin: 0 0 12px;
    font-weight: normal;
    font-size: 12px;
    color: #333333;
  }
}

.qrcode-img {
  @extend .common;
  padding: 20px;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .contennier {
    font-weight: bold;
    font-size: 19px;
    span {
      font-weight: bold;
      font-size: 20px;
      margin-left: 5px;
      color: #f14f44;
    }
  }
  // img {
  //   // border: 1px solid #f0f0f0;
  //   // width: 150px;
  //   // height: 150px;
  //   margin-bottom: 10px;
  // }
  .pay {
    text-align: center;
  }
  .pay-img {
    width: 100px;
    height: 100px;
    margin: 22px 0 20px;
  }
  .my-pay {
    width: 80px;
    height: 28px;
    font-weight: 400;
    font-size: 12px;
    line-height: 28px;
    color: #000000;
    opacity: 0.8;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    border-radius: 40px;
    cursor: pointer;
    margin: 0 auto;
  }
  .click-my-pay {
    font-weight: 400;
    font-size: 12px;
    color: #666666;
    opacity: 0.8;
    margin-top: 10px;
  }
  .qr-code {
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    opacity: 0.9;
  }
}
.use {
  @extend .common;
  padding-bottom: 27px;
  .common-title {
    margin-bottom: 14px;
  }
  .svg {
    margin-top: 0 auto;
  }
  .use-box {
    display: flex;
    margin-top: 10px;
    justify-content: space-around;
    align-items: center;
    .img-box {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>