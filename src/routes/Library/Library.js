// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useLocation, useParams, useNavigate } = require('react-router');
const { useSearchParams } = require('react-router-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NotFound = require('stremio/routes/NotFound');
const { useProfile, useNotifications, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const { default: toPath } = require('stremio-router/toPath');
const { DelayedRenderer, Chips, Image, MainNavBars, LibItem, MultiselectMenu } = require('stremio/components');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const SCROLL_TO_BOTTOM_TRESHOLD = 400;

function withModel(Library) {
    const LibraryWithModel = () => {
        const location = useLocation();
        const model = React.useMemo(() => {
            return typeof location.pathname === 'string' ?
                location.pathname.match('/library') ?
                    'library'
                    :
                    location.pathname.match('/continuewatching') ?
                        'continue_watching'
                        :
                        null
                :
                null;
        }, [location?.pathname]);

        if (model === null) return <NotFound />;

        return <Library model={model} />;
    };
    LibraryWithModel.displayName = 'LibraryWithModel';
    return LibraryWithModel;
}

const Library = ({ model }) => {
    const { type } = useParams();
    const urlParams = React.useMemo(() => ({
        type
    }), [type]);
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const profile = useProfile();
    const notifications = useNotifications();
    const [library, loadNextPage] = useLibrary(model, urlParams, queryParams);
    const [typeSelect, sortChips, hasNextPage] = useSelectableInputs(library);
    const scrollContainerRef = React.useRef(null);

    // --- LEER DIRECTAMENTE DESDE REDIS / LOCALSTORAGE ---
    const [customCatalog, setCustomCatalog] = React.useState(() => {
        return JSON.parse(localStorage.getItem('stremio_custom_library') || '[]');
    });

    React.useEffect(() => {
        const updateLocal = () => {
            setCustomCatalog(JSON.parse(localStorage.getItem('stremio_custom_library') || '[]'));
        };
        window.addEventListener('custom_library_updated', updateLocal);
        window.addEventListener('storage', updateLocal);
        return () => {
            window.removeEventListener('custom_library_updated', updateLocal);
            window.removeEventListener('storage', updateLocal);
        };
    }, []);

    // Determinar qué catálogo mostrar: si el Core devuelve elementos los usa; si no, usa Redis
    const displayCatalog = (library?.catalog && library.catalog.length > 0)
        ? library.catalog
        : customCatalog;

    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);

    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_TRESHOLD);

    React.useLayoutEffect(() => {
        if (scrollContainerRef.current !== null && library.selected && library.selected.request.page === 1 && library.catalog.length !== 0) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [profile.auth, library.selected]);

    React.useEffect(() => {
        if (!library.selected?.type && typeSelect.value) {
            navigate(toPath(typeSelect.value));
        }
    }, [typeSelect.value, library.selected]);

    return (
        <MainNavBars className={styles['library-container']} route={model}>
            <div className={styles['library-content']}>
                <div className={styles['selectable-inputs-container']}>
                    <MultiselectMenu {...typeSelect} className={styles['select-input-container']} />
                    <Chips {...sortChips} className={styles['select-input-container']} />
                </div>
                {
                    displayCatalog.length === 0 ?
                        <div className={styles['message-container']}>
                            <Image
                                className={styles['image']}
                                src={require('/assets/images/empty.png')}
                                alt={' '}
                            />
                            <div className={styles['message-label']}>{model === 'library' ? t('LIBRARY_EMPTY') : t('BOARD_CONTINUE_WATCHING_EMPTY')}</div>
                        </div>
                        :
                        <div ref={scrollContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')} onScroll={onScroll}>
                            {
                                displayCatalog.map((libItem, index) => (
                                    <LibItem
                                        {...libItem}
                                        key={libItem.id || index}
                                        notifications={notifications}
                                        removable={model === 'library'}
                                        detailsVideosFirst={model === 'library'}
                                    />
                                ))
                            }
                        </div>
                }
            </div>
        </MainNavBars>
    );
};

Library.propTypes = {
    model: PropTypes.oneOf(['library', 'continue_watching']),
};

const LibraryFallback = ({ model }) => (
    <MainNavBars className={styles['library-container']} route={model} />
);

LibraryFallback.propTypes = Library.propTypes;

module.exports = withModel(withCoreSuspender(Library, LibraryFallback));