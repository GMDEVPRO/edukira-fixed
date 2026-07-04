import { createContext, useState, useEffect } from 'react'

/* ════════════════════════════════════════════
   TRANSLATIONS — FR | EN | AR | PT
   ════════════════════════════════════════════ */
const T = {
  fr: {
    dir: 'ltr',
    nav: { features:'Fonctionnalités', integrations:'Intégrations', testimonials:'Témoignages', pricing:'Tarifs', contact:'Contact', start:'Commencer →' },
    hero: {
      badge:"Conçu pour l'Afrique · 10+ pays couverts",
      title1:'Gérez votre école simplement —', title2:'élèves, notes et paiements au même endroit',
      sub:"Arrêtez les tableurs et le papier. Automatisez les bulletins et contrôlez tout en ligne.",
      cta1:'🚀 Essai gratuit 30 jours', cta2:'Voir les fonctionnalités →',
      stat1val:'10+', stat1lbl:'Pays couverts',
      stat2val:'4',   stat2lbl:'Langues · FR · EN · AR · PT',
      stat3val:'Wave',stat3lbl:'Orange Money · MTN MoMo',
    },
    features: {
      label:'Fonctionnalités', title:'Tout ce dont votre école a besoin',
      sub:"Une plateforme complète pour écoles, lycées, universités et instituts.",
      items:[
        { ico:'👨‍🎓', title:'Gestion des élèves', desc:"Inscriptions, dossiers complets, communication via SMS et WhatsApp.", tags:['SMS','WhatsApp','PDF'] },
        { ico:'📋', title:'Présences & Assiduité', desc:"Appel quotidien, alertes parents, taux de présence en temps réel.", tags:['Temps réel','Alertes'] },
        { ico:'📝', title:'Notes & Bulletins PDF', desc:"Saisie, calcul, publication et envoi PDF par WhatsApp.", tags:['PDF','WhatsApp'] },
        { ico:'💳', title:'Paiements Mobile Money', desc:"Wave, Orange Money, MTN MoMo. Reçus PDF automatiques.", tags:['Wave','Orange Money','MTN'] },
        { ico:'🛍️', title:'Marketplace Éducatif', desc:"Vendez fiches, vidéos, livres. Nouvelle source de revenus.", tags:['Revenus','Contenu'] },
        { ico:'🌍', title:'Multi-pays & Langues', desc:"Support FR, EN, AR et PT. Adapté à chaque pays africain.", tags:['Afrique','PT'] },
      ],
    },
    integrations: {
      label:'Intégrations natives', title:"Connecté aux outils que l'Afrique utilise",
      sub:"Pré-configuré, opérationnel dès le premier jour.",
      groups:[
        { label:'💳 Mobile Money', items:[
          { icon:'🌊', bg:'#1BAAED', name:'Wave', desc:"Sénégal, CI", badge:'Actif' },
          { icon:'🟠', bg:'#FF6900', name:'Orange Money', desc:'CI, SN, ML, BF...', badge:'Actif' },
          { icon:'🟡', bg:'#FFCC00', name:'MTN MoMo', desc:'CM, GH, CD...', badge:'Actif' },
        ]},
        { label:'💬 Messagerie', items:[
          { icon:'💬', bg:'#25D366', name:'WhatsApp (Twilio)', desc:'Bulletins & alertes', badge:'Actif' },
          { icon:'📱', bg:'#F59E0B', name:"Africa's Talking", desc:'SMS multi-pays', badge:'Actif' },
        ]},
        { label:'🔔 API', items:[
          { icon:'🔔', bg:'#6366F1', name:'Webhooks Mobile Money', desc:'Confirmation auto', badge:'Natif' },
          { icon:'🌐', bg:'#0B1E42', name:'REST API (Swagger)', desc:'Intégration systèmes', badge:'Natif' },
        ]},
      ],
    },
    testimonials: {
      label:"Ce qu'ils disent", title:'Des écoles qui transforment leur gestion',
      items:[
        { quote:"Edukira a révolutionné la gestion de notre école !", name:'Mme. Diop', role:"Directrice, Les Petits Génies, Sénégal" },
        { quote:"Le marketplace génère des revenus supplémentaires pour nos profs.", name:'M. Koné', role:"Admin, Collège Excellence, CI" },
      ],
      stats:[{ val:'+50', lbl:'Écoles partenaires' },{ val:'95%', lbl:'Satisfaction' },{ val:'10K+', lbl:'Élèves gérés' }],
    },
    how: {
      label:'Comment ça marche ?', title:'3 étapes pour démarrer',
      steps:[
        { n:'1', title:'Créez votre compte', desc:"Inscrivez votre école en quelques minutes." },
        { n:'2', title:'Configurez votre école', desc:"Importez vos élèves et classes." },
        { n:'3', title:'Commencez à gérer', desc:"Paiements automatisés, communication fluide." },
      ],
    },
    ps: {
      label:'Votre défi',
      title:'Transformez la gestion de votre école',
      probTitle:'Problèmes actuels',
      solTitle:'Avec Edukira',
      prob:[
        'Cahiers de notes perdus ou illisibles',
        'Paiements non tracés, impayés oubliés',
        'Zéro communication avec les parents',
        'Bulletins faits à la main, semaines de retard',
        'Aucune visibilité sur les absences',
      ],
      sol:[
        'Notes saisies sur mobile, bulletins PDF en 1 clic',
        'Wave, Orange Money & MTN MoMo intégrés',
        'SMS & WhatsApp automatiques aux parents',
        'Bulletins générés et envoyés instantanément',
        'Tableau de présence en temps réel',
      ],
    },
    pricing: {
      label:'Tarifs', title:'Plans adaptés à chaque école',
      sub:"Flexibilité et transparence.",
      popular:'Le plus populaire',
      plans:[
        { id:'STARTER', name:'Starter', desc:'Petites écoles', price:'29€', period:'/mois', feats:["200 élèves","SMS inclus","Portail élève","Support email"] },
        { id:'PRO', name:'Pro', desc:'Le plus populaire', price:'69€', period:'/mois', feats:["1000 élèves","SMS + WhatsApp","Mobile Money","Marketplace","Support prioritaire"], featured:true },
        { id:'ENTERPRISE', name:'Enterprise', desc:'Grandes institutions', price:'149€', period:'/mois', feats:["Illimité","Multi-campus","API dédiée","Support 24/7","Onboarding dédié"] },
      ],
    },
    contact: {
      label:'Contactez-nous', title:'Prêt à transformer votre école ?',
      sub:"Demandez une démo gratuite.",
      namePh:'Nom complet', emailPh:'Email professionnel',
      schoolPh:'Nom de l\'école', phonePh:'Téléphone (WhatsApp)',
      msgPh:'Comment pouvons-nous aider ?',
      submit:'Envoyer', sending:'Envoi...', sent:'✅ Envoyé !', error:'❌ Erreur.',
    },
    footer: {
      tagline:"Gestion scolaire simplifiée pour l'Afrique.",
      navLabel:'Navigation', contactLabel:'Contact',
      email:'contact@edukira.com', phone:'+221 77 123 45 67', copy:'Tous droits réservés.',
    },
    register: {
      back:'Accueil', toggle:'Lycée ↔ Uni',
      steps:['Institution','Administrateur','Forfait','Confirmation'],
      headerSub:'Année scolaire 2025/2026',
      s1:"Informations de l'établissement",
      schoolName:"Nom de l'établissement", schoolType:'Type', country:'Pays', city:'Ville',
      phone:'Téléphone', schoolEmail:'Email officiel', students:"Nbre d'élèves", deflang:'Langue',
      s2:"Données de l'administrateur",
      adminFirst:'Prénom', adminLast:'Nom', adminRole:'Fonction',
      adminPhone:'Téléphone', adminEmail:'Email', adminPwd:'Mot de passe',
      pwdHint:'Minimum 8 caractères', idDoc:"Document d'identité", idHint:'Pour vérification du compte.',
      s3:'FORFAITS', popular:'Le plus populaire',
      prev:'Précédent', next:'Suivant', submit:"Créer l'établissement", submitting:'Création...',
      s4:'Récapitulatif', institutionLabel:'Institution', adminLabel:'Administrateur', planLabel:'Forfait',
      successTitle:'Établissement créé !', successSub:'Vérifiez votre email.', goHome:"Retour à l'accueil",
      errRequired:'Remplissez tous les champs.', errApi:'Erreur. Réessayez.',
    },
    // student register
    student: {
      tab1:'Je suis élève', tab2:'Je suis parent / tuteur',
      idNotice:'Munissez-vous de la pièce d\'identité avant de commencer.',
      idLabelStudent:"N° identité de l'élève", idLabelTutor:'N° identité du tuteur',
      required:'Requis',
      submit:'Créer mon compte', submitting:'Création...', done:'Compte créé ✅',
    },
  },

  en: {
    dir: 'ltr',
    nav: { features:'Features', integrations:'Integrations', testimonials:'Testimonials', pricing:'Pricing', contact:'Contact', start:'Get started →' },
    hero: {
      badge:'Built for Africa · 10+ countries covered',
      title1:'Manage your school simply —', title2:'students, grades and payments in one place',
      sub:'Stop using spreadsheets and paper. Automate reports and control everything online.',
      cta1:'🚀 Free 30-day trial', cta2:'See features →',
      stat1val:'10+', stat1lbl:'Countries covered',
      stat2val:'4',   stat2lbl:'Languages · FR · EN · AR · PT',
      stat3val:'Wave',stat3lbl:'Orange Money · MTN MoMo',
    },
    features: {
      label:'Features', title:'Everything your school needs',
      sub:'A complete platform for schools, universities and institutes.',
      items:[
        { ico:'👨‍🎓', title:'Student management', desc:'Online enrolments, complete records, SMS & WhatsApp.', tags:['SMS','WhatsApp','PDF'] },
        { ico:'📋', title:'Attendance tracking', desc:'Daily roll call, parent alerts, real-time rates.', tags:['Real time','Alerts'] },
        { ico:'📝', title:'Grades & PDF Reports', desc:'Entry, calculation, PDF reports via WhatsApp.', tags:['PDF','WhatsApp'] },
        { ico:'💳', title:'Mobile Money Payments', desc:'Wave, Orange Money, MTN MoMo. Auto PDF receipts.', tags:['Wave','Orange','MTN'] },
        { ico:'🛍️', title:'Educational Marketplace', desc:'Sell worksheets, videos, e-books. New revenue stream.', tags:['Revenue','Content'] },
        { ico:'🌍', title:'Multi-country & Languages', desc:'FR, EN, AR and PT support. Adapted to Africa.', tags:['Africa','PT'] },
      ],
    },
    integrations: {
      label:'Native integrations', title:'Connected to the tools Africa uses',
      sub:'Pre-configured, operational from day one.',
      groups:[
        { label:'💳 Mobile Money', items:[
          { icon:'🌊', bg:'#1BAAED', name:'Wave', desc:'Senegal, CI', badge:'Active' },
          { icon:'🟠', bg:'#FF6900', name:'Orange Money', desc:'CI, SN, ML, BF...', badge:'Active' },
          { icon:'🟡', bg:'#FFCC00', name:'MTN MoMo', desc:'CM, GH, CD...', badge:'Active' },
        ]},
        { label:'💬 Messaging', items:[
          { icon:'💬', bg:'#25D366', name:'WhatsApp (Twilio)', desc:'Reports & alerts', badge:'Active' },
          { icon:'📱', bg:'#F59E0B', name:"Africa's Talking", desc:'Multi-country SMS', badge:'Active' },
        ]},
        { label:'🔔 API', items:[
          { icon:'🔔', bg:'#6366F1', name:'Mobile Money Webhooks', desc:'Auto confirmation', badge:'Native' },
          { icon:'🌐', bg:'#0B1E42', name:'REST API (Swagger)', desc:'System integration', badge:'Native' },
        ]},
      ],
    },
    testimonials: {
      label:'What they say', title:'Schools transforming their management',
      items:[
        { quote:'Edukira revolutionized how we manage our school!', name:'Mme. Diop', role:'Director, Les Petits Génies, Senegal' },
        { quote:'The marketplace generates extra income for our teachers.', name:'M. Koné', role:'Admin, Excellence College, CI' },
      ],
      stats:[{ val:'+50', lbl:'Partner schools' },{ val:'95%', lbl:'Satisfaction' },{ val:'10K+', lbl:'Students managed' }],
    },
    how: {
      label:'How it works', title:'3 steps to get started',
      steps:[
        { n:'1', title:'Create your account', desc:'Register your school in minutes.' },
        { n:'2', title:'Configure your school', desc:'Import your students and classes.' },
        { n:'3', title:'Start managing', desc:'Automated payments, fluid communication.' },
      ],
    },
    ps: {
      label:'Your challenge',
      title:'Transform how your school is managed',
      probTitle:'Current problems',
      solTitle:'With Edukira',
      prob:[
        'Lost or illegible grade books',
        'Untracked payments, forgotten arrears',
        'Zero communication with parents',
        'Report cards done by hand, weeks late',
        'No visibility on student absences',
      ],
      sol:[
        'Grades on mobile, PDF reports in 1 click',
        'Wave, Orange Money & MTN MoMo integrated',
        'Automatic SMS & WhatsApp to parents',
        'Reports generated and sent instantly',
        'Real-time attendance dashboard',
      ],
    },
    pricing: {
      label:'Pricing', title:'Plans for every school',
      sub:'Flexibility and transparency.',
      popular:'Most popular',
      plans:[
        { id:'STARTER', name:'Starter', desc:'Small schools', price:'29€', period:'/month', feats:['200 students','SMS included','Student portal','Email support'] },
        { id:'PRO', name:'Pro', desc:'Most popular', price:'69€', period:'/month', feats:['1000 students','SMS + WhatsApp','Mobile Money','Marketplace','Priority support'], featured:true },
        { id:'ENTERPRISE', name:'Enterprise', desc:'Large institutions', price:'149€', period:'/month', feats:['Unlimited','Multi-campus','Dedicated API','24/7 support','Onboarding'] },
      ],
    },
    contact: {
      label:'Contact us', title:'Ready to transform your school?',
      sub:'Request a free demo.',
      namePh:'Full name', emailPh:'Professional email',
      schoolPh:'School name', phonePh:'Phone (WhatsApp)',
      msgPh:'How can we help?',
      submit:'Send', sending:'Sending...', sent:'✅ Sent!', error:'❌ Error.',
    },
    footer: {
      tagline:'Simplified school management for Africa.',
      navLabel:'Navigation', contactLabel:'Contact',
      email:'contact@edukira.com', phone:'+221 77 123 45 67', copy:'All rights reserved.',
    },
    register: {
      back:'Home', toggle:'School ↔ Uni',
      steps:['Institution','Administrator','Plan','Confirmation'],
      headerSub:'Academic year 2025/2026',
      s1:'Institution details',
      schoolName:'Institution name', schoolType:'Type', country:'Country', city:'City',
      phone:'Phone', schoolEmail:'Official email', students:'Est. students', deflang:'Language',
      s2:'Administrator data',
      adminFirst:'First name', adminLast:'Last name', adminRole:'Role',
      adminPhone:'Phone', adminEmail:'Email', adminPwd:'Password',
      pwdHint:'Minimum 8 characters', idDoc:'Identity document', idHint:'For account verification.',
      s3:'PLANS', popular:'Most popular',
      prev:'Previous', next:'Next', submit:'Create institution', submitting:'Creating...',
      s4:'Summary', institutionLabel:'Institution', adminLabel:'Administrator', planLabel:'Plan',
      successTitle:'Institution created!', successSub:'Check your email.', goHome:'Back to home',
      errRequired:'Fill in all required fields.', errApi:'An error occurred.',
    },
    student: {
      tab1:'I am a student', tab2:'I am a parent / tutor',
      idNotice:'Please have your identity document ready before starting.',
      idLabelStudent:"Student's ID number", idLabelTutor:"Tutor's ID number",
      required:'Required',
      submit:'Create my account', submitting:'Creating...', done:'Account created ✅',
    },
  },

  ar: {
    dir: 'rtl',
    nav: { features:'المميزات', integrations:'التكاملات', testimonials:'الشهادات', pricing:'الأسعار', contact:'تواصل', start:'← ابدأ الآن' },
    hero: {
      badge:'مصمّم لأفريقيا · أكثر من 10 دول',
      title1:'إدارة مدرستك ببساطة —', title2:'الطلاب والدرجات والمدفوعات في مكان واحد',
      sub:'توقف عن استخدام الجداول. أتمتة التقارير والتحكم عبر الإنترنت.',
      cta1:'🚀 تجربة مجانية 30 يوماً', cta2:'← استكشف المميزات',
      stat1val:'+10', stat1lbl:'دولة مشمولة',
      stat2val:'4',   stat2lbl:'لغات: FR · EN · AR · PT',
      stat3val:'Wave',stat3lbl:'Orange Money · MTN MoMo',
    },
    features: {
      label:'المميزات', title:'كل ما تحتاجه مدرستك',
      sub:'منصة متكاملة للمدارس والجامعات.',
      items:[
        { ico:'👨‍🎓', title:'إدارة الطلاب', desc:'تسجيل إلكتروني وتواصل عبر SMS وWhatsApp.', tags:['SMS','WhatsApp','PDF'] },
        { ico:'📋', title:'الحضور والغياب', desc:'نداء يومي وتنبيهات للأهل.', tags:['فوري','تنبيهات'] },
        { ico:'📝', title:'الدرجات وكشوف النتائج', desc:'إنشاء كشوف PDF وإرسالها عبر WhatsApp.', tags:['PDF','WhatsApp'] },
        { ico:'💳', title:'مدفوعات Mobile Money', desc:'Wave وOrange Money وMTN MoMo.', tags:['Wave','Orange','MTN'] },
        { ico:'🛍️', title:'السوق التعليمي', desc:'بيع الدروس والمحتوى. مصدر دخل جديد.', tags:['إيرادات','محتوى'] },
        { ico:'🌍', title:'متعدد الدول واللغات', desc:'دعم AR, FR, EN, PT. مكيّف لأفريقيا.', tags:['توطين','PT'] },
      ],
    },
    integrations: {
      label:'تكاملات أصلية', title:'متصل بأدوات أفريقيا',
      sub:'جاهز من اليوم الأول.',
      groups:[
        { label:'💳 Mobile Money', items:[
          { icon:'🌊', bg:'#1BAAED', name:'Wave', desc:'السنغال، كوت ديفوار', badge:'نشط' },
          { icon:'🟠', bg:'#FF6900', name:'Orange Money', desc:'CI, SN, ML...', badge:'نشط' },
          { icon:'🟡', bg:'#FFCC00', name:'MTN MoMo', desc:'الكاميرون، غانا...', badge:'نشط' },
        ]},
        { label:'💬 الرسائل', items:[
          { icon:'💬', bg:'#25D366', name:'WhatsApp (Twilio)', desc:'كشوف وتنبيهات', badge:'نشط' },
          { icon:'📱', bg:'#F59E0B', name:"Africa's Talking", desc:'SMS متعدد الدول', badge:'نشط' },
        ]},
        { label:'🔔 API', items:[
          { icon:'🔔', bg:'#6366F1', name:'Webhooks', desc:'تأكيد تلقائي', badge:'أصلي' },
          { icon:'🌐', bg:'#0B1E42', name:'REST API', desc:'تكامل الأنظمة', badge:'أصلي' },
        ]},
      ],
    },
    testimonials: {
      label:'ماذا يقولون', title:'مدارس تحوّل إدارتها',
      items:[
        { quote:'إدوكيرا غيّرت طريقة إدارتنا للمدرسة!', name:'السيدة ديوب', role:'مديرة، السنغال' },
        { quote:'السوق التعليمي رائع لزيادة دخل المعلمين.', name:'السيد كوني', role:'مدير، كوت ديفوار' },
      ],
      stats:[{ val:'+50', lbl:'مدرسة شريكة' },{ val:'95%', lbl:'رضا العملاء' },{ val:'+10K', lbl:'طالب مسجّل' }],
    },
    how: {
      label:'كيف يعمل؟', title:'3 خطوات للبدء',
      steps:[
        { n:'١', title:'أنشئ حسابك', desc:'سجّل مدرستك في دقائق.' },
        { n:'٢', title:'هيّئ مدرستك', desc:'استورد بياناتك وفصولك.' },
        { n:'٣', title:'ابدأ الإدارة', desc:'مدفوعات آلية وتواصل سلس.' },
      ],
    },
    ps: {
      label:'تحديك',
      title:'حوّل طريقة إدارة مدرستك',
      probTitle:'المشاكل الحالية',
      solTitle:'مع إدوكيرا',
      prob:[
        'دفاتر درجات مفقودة أو غير مقروءة',
        'مدفوعات غير متتبعة ومتأخرات منسية',
        'لا تواصل مع أولياء الأمور',
        'كشوف النتائج تُعدّ يدوياً وتتأخر أسابيع',
        'لا رؤية على غياب الطلاب',
      ],
      sol:[
        'تسجيل الدرجات على الهاتف وكشوف PDF بنقرة واحدة',
        'Wave وOrange Money وMTN MoMo مدمجة',
        'رسائل SMS وWhatsApp تلقائية لأولياء الأمور',
        'كشوف نتائج تُنشأ وتُرسل فوراً',
        'لوحة حضور في الوقت الفعلي',
      ],
    },
    pricing: {
      label:'الأسعار', title:'خطط لكل مدرسة',
      sub:'مرونة وشفافية.',
      popular:'الأكثر شعبية',
      plans:[
        { id:'STARTER', name:'Starter', desc:'مدارس صغيرة', price:'29€', period:'/شهر', feats:['200 طالب','SMS','بوابة الطالب','دعم إلكتروني'] },
        { id:'PRO', name:'Pro', desc:'الأكثر شعبية', price:'69€', period:'/شهر', feats:['1000 طالب','SMS + WhatsApp','Mobile Money','السوق','دعم متميز'], featured:true },
        { id:'ENTERPRISE', name:'Enterprise', desc:'مؤسسات كبيرة', price:'149€', period:'/شهر', feats:['غير محدود','متعدد الحرم','API','دعم 24/7','إعداد مخصص'] },
      ],
    },
    contact: {
      label:'تواصل معنا', title:'هل أنت مستعد؟',
      sub:'اطلب عرضاً توضيحياً مجانياً.',
      namePh:'اسمك الكامل', emailPh:'بريدك المهني',
      schoolPh:'اسم مدرستك', phonePh:'هاتفك (WhatsApp)',
      msgPh:'كيف يمكننا المساعدة؟',
      submit:'إرسال', sending:'جاري الإرسال...', sent:'✅ تم!', error:'❌ خطأ.',
    },
    footer: {
      tagline:'إدارة مدرسية مبسّطة لأفريقيا.',
      navLabel:'التنقل', contactLabel:'تواصل',
      email:'contact@edukira.com', phone:'+221 77 123 45 67', copy:'جميع الحقوق محفوظة.',
    },
    register: {
      back:'الرئيسية', toggle:'مدرسة ↔ جامعة',
      steps:['المؤسسة','المسؤول','الخطة','التأكيد'],
      headerSub:'العام الدراسي 2025/2026',
      s1:'بيانات المؤسسة',
      schoolName:'اسم المؤسسة', schoolType:'النوع', country:'البلد', city:'المدينة',
      phone:'الهاتف', schoolEmail:'البريد الرسمي', students:'عدد الطلاب', deflang:'اللغة',
      s2:'بيانات المسؤول',
      adminFirst:'الاسم الأول', adminLast:'اللقب', adminRole:'المنصب',
      adminPhone:'الهاتف', adminEmail:'البريد', adminPwd:'كلمة المرور',
      pwdHint:'8 أحرف على الأقل', idDoc:'وثيقة هوية المسؤول', idHint:'للتحقق من الحساب.',
      s3:'الخطط', popular:'الأكثر شعبية',
      prev:'السابق', next:'التالي', submit:'إنشاء المؤسسة', submitting:'جاري الإنشاء...',
      s4:'ملخص', institutionLabel:'المؤسسة', adminLabel:'المسؤول', planLabel:'الخطة',
      successTitle:'تم الإنشاء!', successSub:'تحقق من بريدك.', goHome:'العودة للرئيسية',
      errRequired:'يرجى ملء جميع الحقول.', errApi:'حدث خطأ.',
    },
    student: {
      tab1:'أنا طالب', tab2:'أنا ولي أمر / وصي',
      idNotice:'يرجى إحضار وثيقة الهوية قبل البدء.',
      idLabelStudent:'رقم هوية الطالب', idLabelTutor:'رقم هوية الوصي',
      required:'مطلوب',
      submit:'إنشاء حسابي', submitting:'جاري الإنشاء...', done:'تم إنشاء الحساب ✅',
    },
  },

  /* ════════════ PORTUGUÊS (Angola, Moçambique, Cabo Verde) ════════════ */
  pt: {
    dir: 'ltr',
    nav: { features:'Funcionalidades', integrations:'Integrações', testimonials:'Testemunhos', pricing:'Preços', contact:'Contacto', start:'Começar →' },
    hero: {
      badge:'Feito para África · +10 países',
      title1:'Gira a tua escola de forma simples —', title2:'alunos, notas e pagamentos num só lugar',
      sub:'Chega de folhas de cálculo e papel. Automatiza relatórios e controla tudo online.',
      cta1:'🚀 Teste gratuito 30 dias', cta2:'Ver funcionalidades →',
      stat1val:'+10', stat1lbl:'Países cobertos',
      stat2val:'4',   stat2lbl:'Línguas · FR · EN · AR · PT',
      stat3val:'Wave',stat3lbl:'Orange Money · MTN MoMo',
    },
    features: {
      label:'Funcionalidades', title:'Tudo o que a tua escola precisa',
      sub:'Plataforma completa para escolas, liceus, universidades e institutos.',
      items:[
        { ico:'👨‍🎓', title:'Gestão de alunos', desc:'Inscrições online, fichas completas, SMS e WhatsApp aos encarregados.', tags:['SMS','WhatsApp','PDF'] },
        { ico:'📋', title:'Presenças & Assiduidade', desc:'Chamada diária, alertas automáticos, taxa de presença em tempo real.', tags:['Tempo real','Alertas'] },
        { ico:'📝', title:'Notas & Boletins PDF', desc:'Lançamento, cálculo automático, boletins PDF via WhatsApp.', tags:['PDF','WhatsApp'] },
        { ico:'💳', title:'Pagamentos Mobile Money', desc:'Wave, Orange Money, MTN MoMo. Recibos PDF automáticos.', tags:['Wave','Orange','MTN'] },
        { ico:'🛍️', title:'Marketplace Educativo', desc:'Vende fichas, vídeos, e-books. Nova fonte de receita.', tags:['Receita','Conteúdo'] },
        { ico:'🌍', title:'Multi-país & Línguas', desc:'Suporte PT, FR, EN, AR. Adaptado a cada país africano.', tags:['África','PT'] },
      ],
    },
    integrations: {
      label:'Integrações nativas', title:'Ligado às ferramentas que África usa',
      sub:'Pré-configurado, operacional desde o primeiro dia.',
      groups:[
        { label:'💳 Mobile Money', items:[
          { icon:'🌊', bg:'#1BAAED', name:'Wave', desc:'Senegal, CI', badge:'Ativo' },
          { icon:'🟠', bg:'#FF6900', name:'Orange Money', desc:'CI, SN, ML, AO...', badge:'Ativo' },
          { icon:'🟡', bg:'#FFCC00', name:'MTN MoMo', desc:'CM, GH, MZ...', badge:'Ativo' },
        ]},
        { label:'💬 Mensagens', items:[
          { icon:'💬', bg:'#25D366', name:'WhatsApp (Twilio)', desc:'Boletins & alertas', badge:'Ativo' },
          { icon:'📱', bg:'#F59E0B', name:"Africa's Talking", desc:'SMS multi-país', badge:'Ativo' },
        ]},
        { label:'🔔 API', items:[
          { icon:'🔔', bg:'#6366F1', name:'Webhooks Mobile Money', desc:'Confirmação automática', badge:'Nativo' },
          { icon:'🌐', bg:'#0B1E42', name:'REST API (Swagger)', desc:'Integração de sistemas', badge:'Nativo' },
        ]},
      ],
    },
    testimonials: {
      label:'O que dizem', title:'Escolas a transformar a gestão',
      items:[
        { quote:'O Edukira revolucionou a gestão da nossa escola!', name:'Mme. Diop', role:'Diretora, Les Petits Génies, Senegal' },
        { quote:'O marketplace gera receita extra para os nossos professores.', name:'M. Koné', role:'Admin, Colégio Excellence, CI' },
      ],
      stats:[{ val:'+50', lbl:'Escolas parceiras' },{ val:'95%', lbl:'Satisfação' },{ val:'+10K', lbl:'Alunos geridos' }],
    },
    how: {
      label:'Como funciona?', title:'3 passos para começar',
      steps:[
        { n:'1', title:'Cria a tua conta', desc:'Regista a tua escola em minutos.' },
        { n:'2', title:'Configura a tua escola', desc:'Importa alunos e turmas.' },
        { n:'3', title:'Começa a gerir', desc:'Pagamentos automáticos e comunicação fluida.' },
      ],
    },
    ps: {
      label:'O teu desafio',
      title:'Transforma a gestão da tua escola',
      probTitle:'Problemas actuais',
      solTitle:'Com o Edukira',
      prob:[
        'Cadernetas perdidas ou ilegíveis',
        'Pagamentos não registados, dívidas esquecidas',
        'Zero comunicação com os encarregados',
        'Boletins feitos à mão, semanas de atraso',
        'Nenhuma visibilidade sobre as faltas',
      ],
      sol:[
        'Notas no telemóvel, boletins PDF num clique',
        'Wave, Orange Money e MTN MoMo integrados',
        'SMS e WhatsApp automáticos aos encarregados',
        'Boletins gerados e enviados instantaneamente',
        'Painel de presenças em tempo real',
      ],
    },
    pricing: {
      label:'Preços', title:'Planos para cada escola',
      sub:'Flexibilidade e transparência.',
      popular:'Mais popular',
      plans:[
        { id:'STARTER', name:'Starter', desc:'Escolas pequenas', price:'29€', period:'/mês', feats:['200 alunos','SMS incluído','Portal do aluno','Suporte email'] },
        { id:'PRO', name:'Pro', desc:'Mais popular', price:'69€', period:'/mês', feats:['1000 alunos','SMS + WhatsApp','Mobile Money','Marketplace','Suporte prioritário'], featured:true },
        { id:'ENTERPRISE', name:'Enterprise', desc:'Grandes instituições', price:'149€', period:'/mês', feats:['Ilimitado','Multi-campus','API dedicada','Suporte 24/7','Onboarding'] },
      ],
    },
    contact: {
      label:'Contacta-nos', title:'Pronto para transformar a tua escola?',
      sub:'Pede uma demo gratuita.',
      namePh:'Nome completo', emailPh:'Email profissional',
      schoolPh:'Nome da escola', phonePh:'Telemóvel (WhatsApp)',
      msgPh:'Como podemos ajudar?',
      submit:'Enviar', sending:'A enviar...', sent:'✅ Enviado!', error:'❌ Erro.',
    },
    footer: {
      tagline:'Gestão escolar simplificada para África.',
      navLabel:'Navegação', contactLabel:'Contacto',
      email:'contact@edukira.com', phone:'+221 77 123 45 67', copy:'Todos os direitos reservados.',
    },
    register: {
      back:'Início', toggle:'Escola ↔ Uni',
      steps:['Instituição','Administrador','Plano','Confirmação'],
      headerSub:'Ano letivo 2025/2026',
      s1:'Dados da instituição',
      schoolName:'Nome da instituição', schoolType:'Tipo', country:'País', city:'Cidade',
      phone:'Telefone', schoolEmail:'Email oficial', students:'Nº alunos estimado', deflang:'Língua',
      s2:'Dados do administrador',
      adminFirst:'Primeiro nome', adminLast:'Apelido', adminRole:'Cargo',
      adminPhone:'Telefone', adminEmail:'Email', adminPwd:'Palavra-passe',
      pwdHint:'Mínimo 8 caracteres', idDoc:'Documento de identidade', idHint:'Para verificação da conta.',
      s3:'PLANOS', popular:'Mais popular',
      prev:'Anterior', next:'Seguinte', submit:'Criar instituição', submitting:'A criar...',
      s4:'Resumo', institutionLabel:'Instituição', adminLabel:'Administrador', planLabel:'Plano',
      successTitle:'Instituição criada!', successSub:'Verifique o seu email.', goHome:'Voltar ao início',
      errRequired:'Preencha todos os campos obrigatórios.', errApi:'Ocorreu um erro.',
    },
    student: {
      tab1:'Sou aluno', tab2:'Sou encarregado / tutor',
      idNotice:'Tenha o documento de identidade à mão antes de começar.',
      idLabelStudent:'Nº de identidade do aluno (BI / Certidão)', idLabelTutor:'Nº de identidade do tutor',
      required:'Obrigatório',
      submit:'Criar a minha conta', submitting:'A criar...', done:'Conta criada ✅',
    },
  },
}

export const LangContext = createContext(null)

export function LangProvider({ children }) {
  const browserLang = navigator.language.split('-')[0]
  const init = Object.keys(T).includes(browserLang) ? browserLang : 'fr'
  const [lang, setLangState] = useState(init)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir  = T[lang].dir
  }, [lang])

  return (
    <LangContext.Provider value={{
      lang,
      setLang: setLangState,
      t: T[lang],
      isRTL: T[lang].dir === 'rtl',
      langs: Object.keys(T),
    }}>
      {children}
    </LangContext.Provider>
  )
}
