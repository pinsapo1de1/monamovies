// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Popup } = require('stremio/components');
const { useFullscreen } = require('stremio/common/Fullscreen');
const usePWA = require('stremio/common/usePWA');
const NavMenuContent = require('../NavMenuContent');
const Logo = require('./Logo');
const SearchBar = require('./SearchBar');
const styles = require('./styles');

const HorizontalNavBar = React.memo(React.forwardRef(({ className, selected, search, navMenuOpen, onNavMenuOpenChange }, ref) => {
    const { t } = useTranslation();
    const [fullscreen, requestFullscreen, exitFullscreen, , supported] = useFullscreen();
    const [, isAndroidPWA] = usePWA();

    return (
        <nav ref={ref} className={classnames(className, styles['horizontal-nav-bar-container'])}>
            <div className={styles['logo-container']}>
                <Logo />
            </div>
            {
                search ?
                    <SearchBar className={styles['search-bar']} {...search} />
                    :
                    null
            }
            <div className={styles['buttons-container']}>
                {
                    supported && !isAndroidPWA ?
                        <Button
                            className={styles['button-container']}
                            title={fullscreen ? t('EXIT_FULLSCREEN') : t('ENTER_FULLSCREEN')}
                            onClick={fullscreen ? exitFullscreen : requestFullscreen}
                        >
                            <Icon className={styles['icon']} name={fullscreen ? 'minimize' : 'maximize'} />
                        </Button>
                        :
                        null
                }
                <Popup
                    className={styles['nav-menu-popup']}
                    open={navMenuOpen}
                    onOpenChange={onNavMenuOpenChange}
                    label={
                        <Button className={classnames(styles['button-container'], styles['menu-button-container'])} title={t('MENU')}>
                            <Icon className={styles['icon']} name={'user'} />
                        </Button>
                    }
                >
                    <NavMenuContent onClick={onNavMenuOpenChange} />
                </Popup>
            </div>
        </nav>
    );
}));

HorizontalNavBar.displayName = 'HorizontalNavBar';

HorizontalNavBar.propTypes = {
    className: PropTypes.string,
    selected: PropTypes.string,
    search: PropTypes.object,
    navMenuOpen: PropTypes.bool,
    onNavMenuOpenChange: PropTypes.func
};

module.exports = HorizontalNavBar;