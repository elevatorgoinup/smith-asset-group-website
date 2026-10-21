/* Smith Asset Group: PostHog analytics (US cloud).
   Tracks page views plus the actions that matter for deals. Never sends form field values
   (names, phones, emails, addresses typed into forms) and session recording is off. */
(function () {
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_kRWKyrsuoGxLqWj3f8grzg8BZVCj76UKuhUKpY4xnnFo', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: { dom_event_allowlist: ['click', 'submit'], element_allowlist: ['a', 'button', 'form'] },
    disable_session_recording: true,
    mask_all_text: false,
    respect_dnt: true
  });

  function ev(name, props) { try { posthog.capture(name, props || {}); } catch (e) {} }
  var page = location.pathname.split('/').pop() || 'index.html';

  // Form submits (only when the browser says the form is valid, so it matches a real send).
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f || !f.checkValidity || !f.checkValidity()) return;
    if (f.id === 'sellForm') ev('seller_lead_submitted', { page: page });
    else if (f.id === 'buyForm') ev('buyer_first_look_signup', { page: page, source: 'buyer_form' });
    else if (f.classList.contains('fl-q')) ev('buyer_first_look_signup', { page: page, source: 'deal_board' });
    else if (f.classList.contains('lm-askform')) ev('property_inquiry_submitted', { page: page });
    else if (f.id === 'sbPost') ev('deal_posted', { page: page });
    else if (f.getAttribute('data-k') === 'req') ev('deal_details_requested', { page: page });
    else if (f.getAttribute('data-k') === 'offer') ev('deal_offer_submitted', { page: page });
    else if (f.closest('.agents, #agentForm') || /agent/i.test(f.id || '')) ev('agent_form_submitted', { page: page });
  }, true);

  // Map and lead actions.
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('#lmSearchGo')) {
      var q = (document.getElementById('lmSearch') || {}).value || '';
      ev('map_search', { query_type: /^[0-9 -]+$/.test(q.trim()) ? 'parcel' : (/^\d/.test(q.trim()) ? 'address' : 'street_or_owner'), query_length: q.trim().length });
    }
    else if (t.closest('#lmNear')) ev('map_near_me');
    else if (t.closest('#lmSold')) ev('map_sales_toggled');
    else if (t.closest('.lm-share')) ev('map_share_clicked');
    else if (t.closest('.lm-sale')) ev('map_sale_opened');
    else if (t.closest('.lm-chip[data-go], .lm-chip[data-hood]')) ev('map_area_jump', { area: t.closest('.lm-chip').textContent.trim() });
    else if (t.closest('#lmMap path.leaflet-interactive')) ev('map_parcel_tapped');
    else if (t.closest('.lm-own')) ev('map_own_it_clicked');
    else if (t.closest('.lm-ask')) ev('map_ask_opened');
    else if (t.closest('.lm-links a')) ev('map_outbound_link', { link: t.closest('a').textContent.trim() });
    else if (t.closest('.dc')) ev('deal_card_opened', { deal_id: t.closest('.dc').getAttribute('data-id') || '' });
    else if (t.closest('a[href^="tel:"]')) ev('call_clicked', { page: page });
    else if (t.closest('a[href^="sms:"]')) ev('text_clicked', { page: page });
    else if (t.closest('a[href^="mailto:"]')) ev('email_clicked', { page: page });
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'lmSearch') {
      var q = e.target.value || '';
      ev('map_search', { query_type: /^[0-9 -]+$/.test(q.trim()) ? 'parcel' : (/^\d/.test(q.trim()) ? 'address' : 'street_or_owner'), query_length: q.trim().length });
    }
  }, true);
})();
