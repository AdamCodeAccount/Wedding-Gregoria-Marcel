import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, CheckCircle2, Mail, Clock } from 'lucide-react';
import { useGuestManagement } from '../hooks/useGuestManagement';
import { lieuImages, coupleImages, getLieuImagePath, getCoupleImagePath } from '../config/images';
import '../styles/blackGold.css';

const BlackGoldPremium = () => {
  const { addGuest } = useGuestManagement(); 
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date('2026-06-15T00:00:00');
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;
    setIsSending(true);
    await addGuest(formData.name, formData.email);
    setIsSending(false);
    setIsSubmitted(true);
  };

  return (
    <div className="black-gold-premium">

      {/* Gold particles */}
      <div className="gold-particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

     {/* BARRE FIXE EN HAUT */}
    <div className="premium-top-bar">
      <h1 className="premium-top-bar-title premium-serif">Gregoria & Marcel</h1>
  
      <div className="premium-top-bar-content">
        <p className="premium-top-bar-date">27 JUIN 2026</p>
        <div className="premium-top-bar-divider"></div>
        <p className="premium-top-bar-description">
          Ce qui nous unit dépasse le temps.
        </p>
        <p className="premium-top-bar-description">
          Nous avons découvert que l'amour ne se mesure pas en années,
          mais en paix, en respect et en complicité.
        </p>
        <p className="premium-top-bar-description">
          Et c'est cette évidence que nous voulons célébrer avec vous.
        </p>
      </div>
    </div>

      {/* Hero Section */}
      <section className="premium-hero">
        <div className="premium-hero-content">
        </div>
      </section>

      {/* Countdown Section */}
      <section className="premium-countdown">
        <div className="premium-countdown-overlay"></div>
        
        <div className="premium-countdown-container">
          <div className="premium-countdown-header">
            <h2 className="premium-countdown-title premium-serif">Le Grand Jour</h2>
            <div className="premium-countdown-divider"></div>
          </div>

          <div className="premium-countdown-grid">
            {[
              { value: timeLeft.days, label: 'Jours' },
              { value: timeLeft.hours, label: 'Heures' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Secondes' }
            ].map((item, i) => (
              <div key={i} className="premium-countdown-item">
                <div className="premium-countdown-value premium-serif">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="premium-countdown-label premium-sans">
                  {item.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Le Lieu */}
      <section className="premium-gallery premium-gallery-lieu">
        <div className="premium-gallery-container">
          <div className="premium-gallery-header">
            <div className="premium-gallery-divider-top"></div>
            <h2 className="premium-gallery-title premium-serif">Le Lieu</h2>
            <p className="premium-gallery-subtitle premium-sans">
              Un cadre d'exception pour célébrer notre union
            </p>
            <div className="premium-gallery-divider"></div>
          </div>
          
          <div className={`premium-gallery-lieu-layout ${lieuImages.length <= 1 ? 'premium-gallery-lieu-single' : ''}`}>
            {/* Image principale mise en avant */}
            {lieuImages[0] && (
              <div className="premium-gallery-featured premium-gallery-item">
                <div className="premium-gallery-image-wrapper">
                  <img 
                    src={getLieuImagePath(lieuImages[0])} 
                    alt="Le lieu - vue principale"
                    className="premium-gallery-image"
                  />
                  <div className="premium-gallery-overlay">
                    <span className="premium-gallery-icon">✦</span>
                  </div>
                </div>
              </div>
            )}
            {/* Grille des autres images du lieu */}
            <div className="premium-gallery-grid premium-gallery-grid-lieu">
              {lieuImages.slice(1).map((filename, i) => (
                <div key={filename} className="premium-gallery-item">
                  <div className="premium-gallery-image-wrapper">
                    <img 
                      src={getLieuImagePath(filename)} 
                      alt={`Le lieu ${i + 2}`}
                      className="premium-gallery-image"
                    />
                    <div className="premium-gallery-overlay">
                      <span className="premium-gallery-icon">✦</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Le Couple / Notre Histoire */}
      <section className="premium-gallery premium-gallery-couple">
        <div className="premium-gallery-container">
          <div className="premium-gallery-header">
            <div className="premium-gallery-divider-top"></div>
            <h2 className="premium-gallery-title premium-serif">Notre Histoire</h2>
            <p className="premium-gallery-subtitle premium-sans">
              Moments précieux de notre parcours ensemble
            </p>
            <div className="premium-gallery-divider"></div>
          </div>
          
          <div className="premium-histoire-layout">
            <div className="premium-histoire-text premium-histoire-intro">
              <p className="premium-histoire-paragraph premium-sans">
                Il y a des histoires qui se racontent.<br />
                Et d'autres qui se vivent comme une évidence.
              </p>
            </div>

            {coupleImages.slice(0, 2).map((filename, i) => (
              <div key={filename} className="premium-gallery-item">
                <div className="premium-gallery-image-wrapper">
                  <img src={getCoupleImagePath(filename)} alt={`Gregoria & Marcel - moment ${i + 1}`} className="premium-gallery-image" />
                  <div className="premium-gallery-overlay"><span className="premium-gallery-icon">♥</span></div>
                </div>
              </div>
            ))}

            <div className="premium-histoire-text">
              <p className="premium-histoire-paragraph premium-sans">
                Après cinq années d'amour, de complicité et de projets partagés,
                nous avons choisi d'unir nos vies.
              </p>
            </div>

            {coupleImages.slice(2, 4).map((filename, i) => (
              <div key={filename} className="premium-gallery-item">
                <div className="premium-gallery-image-wrapper">
                  <img src={getCoupleImagePath(filename)} alt={`Gregoria & Marcel - moment ${i + 3}`} className="premium-gallery-image" />
                  <div className="premium-gallery-overlay"><span className="premium-gallery-icon">♥</span></div>
                </div>
              </div>
            ))}

            <div className="premium-histoire-text premium-histoire-closing">
              <p className="premium-histoire-paragraph premium-sans">
                Le 27 juin 2026<br />
                au Château Sainte-Agnès à Sutton<br />
                nous célébrerons notre engagement entourés de ceux que nous aimons.
              </p>
            </div>

            {coupleImages.slice(4).map((filename, i) => (
              <div key={filename} className="premium-gallery-item">
                <div className="premium-gallery-image-wrapper">
                  <img src={getCoupleImagePath(filename)} alt={`Gregoria & Marcel - moment ${i + 5}`} className="premium-gallery-image" />
                  <div className="premium-gallery-overlay"><span className="premium-gallery-icon">♥</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="premium-details">
        <div className="premium-details-container">
          <div className="premium-details-grid">
            <div className="premium-detail-card">
              <MapPin className="premium-detail-icon" />
              <h3 className="premium-detail-title premium-serif">Lieu</h3>
              <p className="premium-detail-text premium-sans">Le Château Sainte-Agnès</p>
              <p className="premium-detail-subtext premium-sans">Sutton, Québec</p>
            </div>

            <div className="premium-detail-card">
              <Calendar className="premium-detail-icon" />
              <h3 className="premium-detail-title premium-serif">Date</h3>
              <p className="premium-detail-text premium-sans">27 Juin 2026</p>
              <p className="premium-detail-subtext premium-sans">16h00</p>
            </div>
          </div>

          {/* Le Programme */}
          <div className="premium-programme">
            <h3 className="premium-programme-title premium-serif">Le Programme</h3>
            <div className="premium-programme-divider"></div>
            <ul className="premium-programme-list premium-sans">
              <li><span className="premium-programme-event">Cérémonie</span> — 16h</li>
              <li><span className="premium-programme-event">Cocktail</span> — 17h</li>
              <li><span className="premium-programme-event">Dîner</span> — 19h</li>
              <li><span className="premium-programme-event">Soirée</span> — jusqu'au bout de la nuit</li>
            </ul>
            <div className="premium-programme-dresscode">
              <h4 className="premium-programme-dresscode-title premium-serif">Dress code</h4>
              <p className="premium-programme-dresscode-text premium-sans">Élégance romantique</p>
              <p className="premium-programme-dresscode-subtext premium-sans">Couleurs douces et estivales</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="premium-rsvp">
        <div className="premium-rsvp-overlay"></div>
        
        <div className="premium-rsvp-container">
          <div className="premium-rsvp-box">
            <h2 className="premium-rsvp-title premium-serif">Confirmez votre présence</h2>
            <p className="premium-rsvp-subtitle premium-sans">
              Recevez votre invitation officielle par email
            </p>
            
            {!isSubmitted ? (
              <div className="premium-form">
                <div className="premium-input-group">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="premium-input premium-sans"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="premium-input-group">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="premium-input premium-sans"
                    placeholder="Votre email"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSending || !formData.name || !formData.email}
                  className="premium-button premium-sans"
                >
                  {isSending ? (
                    <>
                      <Clock className="premium-button-icon animate-spin" />
                      ENVOI EN COURS...
                    </>
                  ) : (
                    <>
                      <Mail className="premium-button-icon" />
                      CONFIRMER MA PRÉSENCE
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="premium-success">
                <CheckCircle2 className="premium-success-icon" />
                <h3 className="premium-success-title premium-serif">Merci {formData.name}</h3>
                <p className="premium-success-text premium-sans">Votre présence est confirmée</p>
                <p className="premium-success-email premium-sans">
                  Confirmation envoyée à {formData.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="premium-footer-logo premium-serif">G · M</div>
        <p className="premium-footer-text premium-sans">2026</p>
      </footer>
    </div>
  );
};

export default BlackGoldPremium;